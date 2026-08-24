/**
 * Black-box tests for src/api/contact.php.
 *
 * The endpoint is PHP, but nothing you have to maintain here is: this suite is
 * TypeScript on Node's built-in test runner with no dependencies, and it drives
 * the real endpoint over real HTTP, talking to a real (if minimal) SMTP server.
 *
 * PHP comes from the php:8.3-cli Docker image, matching the lsphp 8.3 handler on
 * the Zenbox host, so nothing needs installing on the developer's machine. If a
 * local `php` binary exists it is used instead.
 *
 *   npm run test:endpoint
 */

import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://e-perfecthouse.pl';
const RECIPIENT = 'biuro@e-perfecthouse.pl';
const SENDER = 'formularz@e-perfecthouse.pl';

const here = path.dirname(fileURLToPath(import.meta.url));
const endpointSource = path.join(here, '..', 'src', 'api', 'contact.php');

interface CapturedMessage {
  from: string;
  to: string;
  data: string;
}

interface SmtpServer {
  port: number;
  messages: CapturedMessage[];
  close: () => Promise<void>;
}

/** Ask the OS for a port nobody is using, then immediately give it back. */
function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const address = probe.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      probe.close(() => resolve(port));
    });
  });
}

/**
 * A minimal SMTP server: enough of the protocol for the endpoint's client to
 * complete a session, and it keeps every message it accepts so tests can assert
 * on the actual bytes that went over the wire.
 */
function startSmtpServer(port: number): Promise<SmtpServer> {
  const messages: CapturedMessage[] = [];

  const server = net.createServer((socket) => {
    let buffer = '';
    let inData = false;
    let dataBuffer = '';
    let from = '';
    let to = '';
    // AUTH LOGIN sends the username and password as bare base64 lines, which
    // have to be consumed without being read as commands.
    let expectingAuthLines = 0;

    socket.write('220 test.local ESMTP\r\n');

    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8');

      for (;;) {
        if (inData) {
          const terminator = buffer.indexOf('\r\n.\r\n');
          if (terminator === -1) {
            return;
          }
          dataBuffer += buffer.slice(0, terminator);
          buffer = buffer.slice(terminator + 5);
          inData = false;
          messages.push({ from, to, data: dataBuffer });
          dataBuffer = '';
          socket.write('250 2.0.0 Ok: queued\r\n');
          continue;
        }

        const lineEnd = buffer.indexOf('\r\n');
        if (lineEnd === -1) {
          return;
        }
        const line = buffer.slice(0, lineEnd);
        buffer = buffer.slice(lineEnd + 2);

        if (expectingAuthLines > 0) {
          expectingAuthLines -= 1;
          socket.write(expectingAuthLines > 0 ? '334 UGFzc3dvcmQ6\r\n' : '235 2.7.0 Authentication successful\r\n');
          continue;
        }

        const command = line.slice(0, 4).toUpperCase();

        if (command === 'EHLO' || command === 'HELO') {
          socket.write('250-test.local\r\n250 AUTH LOGIN PLAIN\r\n');
        } else if (command === 'AUTH') {
          expectingAuthLines = 2;
          socket.write('334 VXNlcm5hbWU6\r\n');
        } else if (command === 'MAIL') {
          from = line.replace(/^MAIL FROM:\s*/i, '').trim();
          socket.write('250 2.1.0 Ok\r\n');
        } else if (command === 'RCPT') {
          to = line.replace(/^RCPT TO:\s*/i, '').trim();
          socket.write('250 2.1.5 Ok\r\n');
        } else if (command === 'DATA') {
          inData = true;
          socket.write('354 End data with <CR><LF>.<CR><LF>\r\n');
        } else if (command === 'QUIT') {
          socket.write('221 2.0.0 Bye\r\n');
          socket.end();
          return;
        } else if (command === 'RSET' || command === 'NOOP') {
          socket.write('250 2.0.0 Ok\r\n');
        } else {
          socket.write('502 5.5.2 Not implemented\r\n');
        }
      }
    });

    socket.on('error', () => {
      /* client vanished mid-session; nothing useful to do in a test double */
    });
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    // 0.0.0.0 so the PHP container can reach it through the host gateway.
    server.listen(port, '0.0.0.0', () => {
      resolve({
        port,
        messages,
        close: () =>
          new Promise((done) => {
            server.close(() => done());
          }),
      });
    });
  });
}

const dockerAvailable = spawnSync('docker', ['info'], { stdio: 'ignore' }).status === 0;
const localPhp = spawnSync('php', ['-v'], { stdio: 'ignore' }).status === 0;

if (!dockerAvailable && !localPhp) {
  throw new Error('Neither a local `php` binary nor a running Docker daemon is available; cannot run the endpoint tests.');
}

let root = '';
let httpPort = 0;
let smtp: SmtpServer;
let php: ChildProcess;
let smtpHostForPhp = '127.0.0.1';

interface ConfigOverrides {
  [key: string]: unknown;
}

const containerName = `contact-endpoint-test-${process.pid}`;

/**
 * Every generation of the config file allows one extra, unique Origin. Probing
 * with that Origin is how the suite knows the endpoint has actually picked the
 * new file up: a bind mount does not promise the container sees a host write
 * immediately, and asserting against a stale config produces confusing
 * failures a long way from their cause.
 */
let configGeneration = 0;

/**
 * Rewrite the endpoint's config file. PHP reads it per request, so this takes
 * effect with no restart — but see the note on configGeneration above; prefer
 * applyConfig, which also waits for the change to become visible.
 */
function writeConfig(overrides: ConfigOverrides = {}): string {
  configGeneration += 1;
  const sentinel = `https://config-generation-${configGeneration}.invalid`;

  const settings: ConfigOverrides = {
    allowed_origins: [ORIGIN, sentinel],
    recipient: RECIPIENT,
    from_email: SENDER,
    from_name: 'Formularz e-perfecthouse.pl',
    smtp_host: smtpHostForPhp,
    smtp_port: smtp.port,
    smtp_security: 'none',
    smtp_username: 'formularz',
    smtp_password: 'secret',
    smtp_helo: 'e-perfecthouse.pl',
    smtp_timeout: 10,
    rate_limit_dir: '/dev/null/unused',
    rate_limit_salt: 'test-salt',
    // Generous by default so unrelated tests never trip the limiter; the
    // rate-limit test sets its own.
    rate_limit_max: 10000,
    rate_limit_window: 3600,
    error_log_path: '/dev/null/unused',
    error_log_max_bytes: 8192,
    ...overrides,
  };

  if (settings.rate_limit_dir === '/dev/null/unused') {
    settings.rate_limit_dir = path.posix.join(phpRootInsideRunner(), 'contact-ratelimit');
  }
  if (settings.error_log_path === '/dev/null/unused') {
    settings.error_log_path = path.posix.join(phpRootInsideRunner(), 'contact-error.log');
  }

  const render = (value: unknown): string => {
    if (Array.isArray(value)) {
      return '[' + value.map(render).join(', ') + ']';
    }
    if (typeof value === 'number') {
      return String(value);
    }
    return "'" + String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  };

  const body = Object.entries(settings)
    .map(([key, value]) => `    '${key}' => ${render(value)},`)
    .join('\n');

  fs.writeFileSync(path.join(root, 'contact-config.php'), `<?php\n\nreturn [\n${body}\n];\n`);

  return sentinel;
}

/** Write a config and block until the running endpoint is serving it. */
async function applyConfig(overrides: ConfigOverrides = {}): Promise<void> {
  const sentinel = writeConfig(overrides);
  const deadline = Date.now() + 20_000;

  for (;;) {
    try {
      // The sentinel Origin is allowed only by this generation of the config.
      // A 415 means the Origin check passed and the content-type check took
      // over, which is the cheapest observable proof the new file is live.
      const response = await fetch(`http://127.0.0.1:${httpPort}/api/contact.php`, {
        method: 'POST',
        headers: { Origin: sentinel, 'Content-Type': 'text/plain' },
        body: '{}',
        signal: AbortSignal.timeout(5000),
      });
      if (response.status === 415) {
        return;
      }
    } catch {
      /* server still coming up */
    }

    if (Date.now() > deadline) {
      throw new Error('endpoint never picked up the updated config file');
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

/** Path of the deployment root as the PHP process sees it. */
function phpRootInsideRunner(): string {
  return dockerAvailable ? '/srv' : root;
}

async function post(body: unknown, init: { origin?: string | null; contentType?: string | null; method?: string; raw?: string } = {}) {
  const headers: Record<string, string> = {};
  const origin = init.origin === undefined ? ORIGIN : init.origin;
  if (origin !== null) {
    headers['Origin'] = origin;
  }
  const contentType = init.contentType === undefined ? 'application/json' : init.contentType;
  if (contentType !== null) {
    headers['Content-Type'] = contentType;
  }

  const response = await fetch(`http://127.0.0.1:${httpPort}/api/contact.php`, {
    method: init.method ?? 'POST',
    headers,
    body: init.method === 'GET' ? undefined : (init.raw ?? JSON.stringify(body)),
  });

  let json: { ok?: boolean; error?: string } = {};
  try {
    json = (await response.json()) as typeof json;
  } catch {
    /* some responses legitimately have no body worth parsing */
  }

  return { status: response.status, json, headers: response.headers };
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    typ: 'sprzedam',
    website: '',
    personalData: {
      name: 'Zażółć Gęślą Jaźń',
      phoneNumber: '+48 601 234 567',
      email: 'klient@example.com',
    },
    propertyDetails: {
      propertyType: 'Mieszkanie',
      region: 'wielkopolskie',
      city: 'Poznań',
      priceFrom: '',
      priceTo: '',
      areaFrom: '',
      areaTo: '',
      address: 'ul. Świętego Marcin 1',
      price: '750000',
    },
    ...overrides,
  };
}

/** Decode the base64 body out of a captured RFC 5322 message. */
function decodeBody(raw: string): string {
  const separator = raw.indexOf('\r\n\r\n');
  const body = raw.slice(separator + 4).replace(/\r\n/g, '');
  return Buffer.from(body, 'base64').toString('utf8');
}

function headerValue(raw: string, name: string): string {
  const headerBlock = raw.slice(0, raw.indexOf('\r\n\r\n'));
  // Unfold continuation lines before matching.
  const unfolded = headerBlock.replace(/\r\n[ \t]+/g, ' ');
  const match = unfolded.split('\r\n').find((line) => line.toLowerCase().startsWith(name.toLowerCase() + ':'));
  return match ? match.slice(name.length + 1).trim() : '';
}

before(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'contact-endpoint-'));
  fs.mkdirSync(path.join(root, 'public_html', 'api'), { recursive: true });
  fs.copyFileSync(endpointSource, path.join(root, 'public_html', 'api', 'contact.php'));

  const smtpPort = await freePort();
  smtp = await startSmtpServer(smtpPort);
  httpPort = await freePort();

  if (dockerAvailable) {
    smtpHostForPhp = 'host.docker.internal';
    writeConfig();
    php = spawn(
      'docker',
      [
        'run',
        '--rm',
        '--name',
        containerName,
        '--user',
        `${process.getuid?.() ?? 0}:${process.getgid?.() ?? 0}`,
        '--add-host',
        'host.docker.internal:host-gateway',
        '-p',
        `127.0.0.1:${httpPort}:8080`,
        '-v',
        `${root}:/srv`,
        'php:8.3-cli',
        'php',
        '-S',
        '0.0.0.0:8080',
        '-t',
        '/srv/public_html',
      ],
      { stdio: 'ignore' },
    );
  } else {
    writeConfig();
    php = spawn('php', ['-S', `127.0.0.1:${httpPort}`, '-t', path.join(root, 'public_html')], { stdio: 'ignore' });
  }

  // Wait for the server to answer, and for it to be serving our config.
  //
  // Every request here carries its own timeout: Docker publishes the port on
  // the host as soon as the container is created, so a connection to a
  // not-yet-listening server is accepted and then hangs indefinitely rather
  // than being refused.
  const deadline = Date.now() + 120_000;
  for (;;) {
    try {
      await fetch(`http://127.0.0.1:${httpPort}/api/contact.php`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      });
      break;
    } catch {
      if (Date.now() > deadline) {
        throw new Error('PHP server did not become ready in time');
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  await applyConfig();
});

after(async () => {
  php?.kill();
  if (dockerAvailable) {
    spawnSync('docker', ['rm', '-f', containerName], { stdio: 'ignore' });
  }
  await smtp?.close();
  if (root) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('request gating', () => {
  it('rejects GET with 405 and advertises POST', async () => {
    const response = await post(null, { method: 'GET' });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('allow'), 'POST');
  });

  it('rejects PUT with 405', async () => {
    const response = await post(validPayload(), { method: 'PUT' });
    assert.equal(response.status, 405);
  });

  it('rejects a foreign Origin', async () => {
    const response = await post(validPayload(), { origin: 'https://evil.example.com' });
    assert.equal(response.status, 403);
    assert.equal(response.json.error, 'forbidden_origin');
  });

  it('rejects a missing Origin', async () => {
    const response = await post(validPayload(), { origin: null });
    assert.equal(response.status, 403);
  });

  it('rejects a non-JSON content type', async () => {
    const response = await post(validPayload(), { contentType: 'application/x-www-form-urlencoded' });
    assert.equal(response.status, 415);
  });

  it('rejects an oversized payload', async () => {
    const response = await post(null, { raw: JSON.stringify({ website: '', filler: 'x'.repeat(20000) }) });
    assert.equal(response.status, 413);
  });

  it('rejects a malformed body', async () => {
    const response = await post(null, { raw: 'not json at all' });
    assert.equal(response.status, 400);
  });
});

describe('field validation', () => {
  it('rejects a malformed email address', async () => {
    const before = smtp.messages.length;
    const payload = validPayload();
    payload.personalData.email = 'definitely-not-an-email';
    const response = await post(payload);
    assert.equal(response.status, 422);
    assert.equal(smtp.messages.length, before, 'no mail may be sent for an invalid address');
  });

  it('rejects CRLF in the email field without producing a header injection', async () => {
    const before = smtp.messages.length;
    const payload = validPayload();
    payload.personalData.email = 'klient@example.com\r\nBcc: victim@example.com';
    const response = await post(payload);
    assert.equal(response.status, 422);
    assert.equal(smtp.messages.length, before, 'the injected header must never reach the wire');
  });

  it('rejects a bare LF in the email field', async () => {
    const payload = validPayload();
    payload.personalData.email = 'klient@example.com\nBcc: victim@example.com';
    assert.equal((await post(payload)).status, 422);
  });

  it('rejects CRLF in the name field', async () => {
    const payload = validPayload();
    payload.personalData.name = 'Jan\r\nX-Injected: yes';
    assert.equal((await post(payload)).status, 422);
  });

  it('rejects a missing required field', async () => {
    const payload = validPayload();
    payload.personalData.phoneNumber = '';
    assert.equal((await post(payload)).status, 422);
  });

  it('accepts a submission whose unused property fields are empty', async () => {
    const before = smtp.messages.length;
    const response = await post(
      validPayload({
        typ: 'szukam',
        propertyDetails: {
          propertyType: 'Dom',
          region: 'wielkopolskie',
          city: 'Poznań',
          priceFrom: '500000',
          priceTo: '900000',
          areaFrom: '',
          areaTo: '',
          address: '',
          price: '',
        },
      }),
    );
    assert.equal(response.status, 200);
    assert.equal(smtp.messages.length, before + 1);

    const body = decodeBody(smtp.messages[smtp.messages.length - 1].data);
    assert.match(body, /SZUKAM NIERUCHOMOŚCI/);
    assert.match(body, /Cena od: 500000/);
    assert.doesNotMatch(body, /Adres nieruchomości/, 'empty fields should be omitted, not shown blank');
  });
});

describe('honeypot', () => {
  it('sends nothing when the honeypot is filled, while answering 200', async () => {
    const before = smtp.messages.length;
    const response = await post(validPayload({ website: 'http://spam.example.com' }));
    assert.equal(response.status, 200);
    assert.equal(response.json.ok, true, 'a bot should not learn which field betrayed it');
    assert.equal(smtp.messages.length, before, 'no mail may be sent for a honeypot hit');
  });
});

describe('successful delivery', () => {
  it('delivers a well-formed message with the visitor only in Reply-To', async () => {
    const before = smtp.messages.length;
    const response = await post(validPayload());
    assert.equal(response.status, 200);
    assert.deepEqual(response.json, { ok: true });
    assert.equal(smtp.messages.length, before + 1);

    const message = smtp.messages[smtp.messages.length - 1];

    assert.equal(message.from, `<${SENDER}>`, 'envelope sender must be the site mailbox, for SPF alignment');
    assert.equal(message.to, `<${RECIPIENT}>`);

    const from = headerValue(message.data, 'From');
    assert.match(from, new RegExp(`<${SENDER}>$`));
    assert.doesNotMatch(from, /klient@example\.com/, 'the visitor must never be the From: address');

    assert.match(headerValue(message.data, 'Reply-To'), /<klient@example\.com>$/);
    assert.equal(headerValue(message.data, 'Content-Type'), 'text/plain; charset=UTF-8');

    const body = decodeBody(message.data);
    assert.match(body, /CHCĘ SPRZEDAĆ\/WYNAJĄĆ/);
    assert.match(body, /Zażółć Gęślą Jaźń/, 'Polish characters must survive the transfer encoding');
    assert.match(body, /\+48 601 234 567/);
    assert.match(body, /ul\. Świętego Marcin 1/);
  });

  it('does not leak an injection attempt into the headers of a legitimate send', async () => {
    const payload = validPayload();
    payload.personalData.name = 'Jan Kowalski';
    await post(payload);

    const message = smtp.messages[smtp.messages.length - 1];
    const headerBlock = message.data.slice(0, message.data.indexOf('\r\n\r\n'));
    assert.doesNotMatch(headerBlock, /^Bcc:/im);
    assert.doesNotMatch(headerBlock, /^X-Injected:/im);
  });
});

describe('rate limiting', () => {
  it('starts refusing once the per-IP limit is exceeded', async () => {
    await applyConfig({
      rate_limit_max: 3,
      rate_limit_window: 3600,
      rate_limit_dir: path.posix.join(phpRootInsideRunner(), 'ratelimit-test'),
      rate_limit_salt: `limit-${Date.now()}`,
    });

    const statuses: number[] = [];
    for (let attempt = 0; attempt < 5; attempt++) {
      statuses.push((await post(validPayload())).status);
    }

    assert.deepEqual(statuses.slice(0, 3), [200, 200, 200]);
    assert.deepEqual(statuses.slice(3), [429, 429]);

    await applyConfig();
  });
});

/** Read a file the PHP process wrote, from wherever it actually wrote it. */
function readRunnerFile(relativePath: string): string {
  if (dockerAvailable) {
    const read = spawnSync('docker', ['exec', containerName, 'cat', path.posix.join('/srv', relativePath)], {
      encoding: 'utf8',
    });
    return read.status === 0 ? read.stdout : '';
  }
  const full = path.join(root, relativePath);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

describe('failure handling', () => {
  it('answers 502 when the mail server is unreachable, rather than claiming success', async () => {
    const deadPort = await freePort();
    await applyConfig({ smtp_port: deadPort, smtp_timeout: 3 });

    const response = await post(validPayload());
    assert.equal(response.status, 502);
    assert.equal(response.json.ok, false);

    await applyConfig();
  });

  it('logs the failure stage without leaking any personal data', async () => {
    const deadPort = await freePort();
    await applyConfig({ smtp_port: deadPort, smtp_timeout: 3, error_log_path: path.posix.join(phpRootInsideRunner(), 'contact-error.log') });

    const payload = validPayload();
    payload.personalData.name = 'Nieujawnialny Testowicz';
    payload.personalData.email = 'nieujawnialny@example.com';
    const response = await post(payload);
    assert.equal(response.status, 502);

    const log = readRunnerFile('contact-error.log');
    assert.match(log, /event=mail_failed/);
    assert.match(log, /detail=connect/, 'the failed SMTP stage should be recorded');
    assert.doesNotMatch(log, /Nieujawnialny/, 'the log must never contain a submitted name');
    assert.doesNotMatch(log, /nieujawnialny@example\.com/, 'the log must never contain a submitted email');

    await applyConfig();
  });

  it('keeps the failure log bounded instead of growing without limit', async () => {
    const deadPort = await freePort();
    const logPath = path.posix.join(phpRootInsideRunner(), 'bounded-error.log');
    const maxBytes = 2048;
    await applyConfig({ smtp_port: deadPort, smtp_timeout: 2, error_log_path: logPath, error_log_max_bytes: maxBytes });

    for (let attempt = 0; attempt < 40; attempt++) {
      await post(validPayload());
    }

    const log = readRunnerFile('bounded-error.log');
    const entryCount = log.split('\n').filter((line) => line.trim() !== '').length;

    assert.ok(Buffer.byteLength(log, 'utf8') < maxBytes * 1.5, `log grew to ${Buffer.byteLength(log, 'utf8')} bytes, past its ${maxBytes}-byte cap`);
    assert.ok(entryCount < 40, 'older entries should have been dropped, not kept forever');
    assert.ok(entryCount > 0, 'the most recent entries should still be present');

    await applyConfig();
  });
});

describe('storage', () => {
  it('writes no enquiry data to disk', async () => {
    const marker = `unikalny-${Date.now()}`;
    const payload = validPayload();
    payload.personalData.name = marker;
    payload.personalData.email = `${marker}@example.com`;

    assert.equal((await post(payload)).status, 200);

    // Scan from wherever the PHP process actually writes. Under Docker that has
    // to be inside the container: scanning the host side of a bind mount could
    // pass simply because a write had not propagated yet, which would make this
    // test look green while proving nothing.
    let offenders: string[];
    if (dockerAvailable) {
      const scan = spawnSync('docker', ['exec', containerName, 'sh', '-c', `grep -rl '${marker}' /srv || true`], {
        encoding: 'utf8',
      });
      assert.equal(scan.status, 0, 'the in-container scan itself must succeed');
      offenders = scan.stdout.split('\n').filter((line) => line.trim() !== '');
    } else {
      offenders = [];
      const walk = (directory: string): void => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
          const full = path.join(directory, entry.name);
          if (entry.isDirectory()) {
            walk(full);
          } else if (fs.readFileSync(full, 'utf8').includes(marker)) {
            offenders.push(full);
          }
        }
      };
      walk(root);
    }

    assert.deepEqual(offenders, [], 'enquiry contents must not be persisted anywhere on the host');
  });
});

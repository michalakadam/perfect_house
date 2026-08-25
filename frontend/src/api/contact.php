<?php

declare(strict_types=1);

/**
 * Contact form endpoint for e-perfecthouse.pl.
 *
 * Replaces the former Formspree integration. Takes the JSON payload posted by
 * ContactFormComponent, and hands it to the agency's own mailbox over
 * authenticated SMTP. No third party is involved and no personal data leaves
 * the hosting account.
 *
 * Deliberate properties, each of which has a test in
 * frontend/test/contact-endpoint.test.ts:
 *
 *  - POST only; everything else is 405.
 *  - Origin must be on the allow list; everything else is 403.
 *  - Every field is rejected outright if it contains CR, LF or any other
 *    control character. This is the mail-header-injection guard and it runs
 *    before any value is placed near a header.
 *  - A CSS-hidden honeypot field is accepted with a 200 and silently dropped.
 *  - Per-IP rate limiting, keyed by a salted hash rather than the address.
 *  - Nothing about an enquiry is ever written to disk or to a log.
 *
 * Configuration lives OUTSIDE the web root, at ../../contact-config.php
 * relative to this file. See docs/rodo-compliance/task-02-endpoint-setup.md.
 *
 * "Log nothing" (above) is about enquiry content, not operational visibility.
 * A server-side failure (mail_failed / internal_error) is appended, as one
 * line with no personal data, to a small size-capped file outside the web
 * root — see logFailure() — so a systemic outage (wrong password, mail host
 * down, TLS broken) can be diagnosed without creating a personal-data store.
 *
 * Written to PHP 7.2-compatible syntax on purpose: the shell on the Zenbox host
 * reports PHP 7.2.34 while the web handler appears to be lsphp 8.3, and this
 * file should not depend on which one wins.
 */

ini_set('display_errors', '0');
ini_set('html_errors', '0');

const MAX_BODY_BYTES = 16384;

/** Field length caps, in bytes. Polish characters cost two bytes each. */
const LIMITS = [
    'name' => 200,
    'phoneNumber' => 60,
    'email' => 254,
    'property' => 300,
];

/** Property fields, in the order they should appear in the email. */
const PROPERTY_LABELS = [
    'propertyType' => 'Rodzaj nieruchomości',
    'region' => 'Region',
    'city' => 'Miasto',
    'priceFrom' => 'Cena od',
    'priceTo' => 'Cena do',
    'areaFrom' => 'Powierzchnia od',
    'areaTo' => 'Powierzchnia do',
    'address' => 'Adres nieruchomości',
    'price' => 'Sugerowana cena',
];

/** Raised when a submitted field fails validation. Never carries its value. */
class InvalidField extends Exception
{
}

/** Raised when the SMTP conversation fails. Never carries enquiry content. */
class SmtpError extends Exception
{
}

/** Default path for the operational failure log, used before config is loaded. */
function defaultErrorLogPath(): string
{
    return __DIR__ . '/../../contact-error.log';
}

/**
 * Append one line to the operational failure log, then keep it under
 * $maxBytes by dropping the oldest lines.
 *
 * $detail must never be enquiry content — callers pass an SMTP stage token
 * (e.g. 'connect', 'auth', 'data') or an exception class name, never a form
 * field. Fails silently: a broken log must never turn a real failure response
 * into a different one.
 */
function logFailure(string $path, int $maxBytes, string $event, string $detail)
{
    $line = sprintf('[%s] event=%s detail=%s%s', date('c'), $event, $detail, PHP_EOL);

    $handle = @fopen($path, 'c+');
    if ($handle === false) {
        return;
    }

    if (flock($handle, LOCK_EX)) {
        $stats = fstat($handle);
        $size = ($stats !== false) ? $stats['size'] : 0;

        if ($size > $maxBytes) {
            $contents = stream_get_contents($handle);
            $contents = is_string($contents) ? $contents : '';
            $tail = substr($contents, -intdiv($maxBytes, 2));
            // Drop a possibly-truncated first line so what remains is whole lines.
            $firstBreak = strpos($tail, "\n");
            if ($firstBreak !== false) {
                $tail = substr($tail, $firstBreak + 1);
            }
            ftruncate($handle, 0);
            rewind($handle);
            fwrite($handle, $tail);
        }

        fseek($handle, 0, SEEK_END);
        fwrite($handle, $line);
        flock($handle, LOCK_UN);
    }

    fclose($handle);
}

/**
 * Emit a JSON response and stop.
 *
 * @param array<string,mixed> $payload
 */
function respond(int $status, array $payload)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Pull one field out of the payload, rejecting anything that could break out of
 * a mail header or misrepresent itself as UTF-8.
 *
 * @param array<string,mixed> $source
 * @throws InvalidField
 */
function field(array $source, string $key, int $maxBytes): string
{
    $value = isset($source[$key]) ? $source[$key] : '';

    // The form posts everything as strings, but a hand-rolled client might send
    // a number for a price. Accept those, reject structures.
    if (is_int($value) || is_float($value)) {
        $value = (string) $value;
    }
    if (!is_string($value)) {
        throw new InvalidField($key);
    }

    // C0 controls and DEL. CR and LF live in this range, which is the whole
    // point: "foo@bar.pl\r\nBcc: victim@example.com" dies here, before anything
    // downstream has a chance to treat it as a header.
    if (preg_match('/[\x00-\x1F\x7F]/', $value) === 1) {
        throw new InvalidField($key);
    }

    // Invalid UTF-8 would be mislabelled by the charset declaration, and can
    // confuse downstream parsers into re-reading bytes as delimiters.
    if (preg_match('//u', $value) !== 1) {
        throw new InvalidField($key);
    }

    $value = trim($value);
    if (strlen($value) > $maxBytes) {
        throw new InvalidField($key);
    }

    return $value;
}

/**
 * Encode a header value as an RFC 2047 encoded-word.
 *
 * Applied unconditionally rather than only to non-ASCII text: it removes any
 * need to reason about quoting, and an encoded-word is always valid where a
 * display name is allowed.
 */
function encodeHeaderText(string $text): string
{
    $chunks = [];
    // 45 bytes of input is 60 bytes of base64, comfortably inside the 75-byte
    // ceiling an encoded-word has once the =?UTF-8?B?...?= wrapper is added.
    // str_split can cut a multi-byte character in half, so step by code point.
    $current = '';
    $characters = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);
    if ($characters === false) {
        $characters = [];
    }
    foreach ($characters as $character) {
        if (strlen($current) + strlen($character) > 45) {
            $chunks[] = $current;
            $current = '';
        }
        $current .= $character;
    }
    if ($current !== '') {
        $chunks[] = $current;
    }

    $encoded = [];
    foreach ($chunks as $chunk) {
        $encoded[] = '=?UTF-8?B?' . base64_encode($chunk) . '?=';
    }

    // Folding whitespace between encoded-words is discarded by the receiver.
    return implode("\r\n ", $encoded);
}

/** Render a "Display Name <addr>" header value, or bare "<addr>" if unnamed. */
function encodeAddress(string $name, string $email): string
{
    if ($name === '') {
        return '<' . $email . '>';
    }

    return encodeHeaderText($name) . ' <' . $email . '>';
}

/**
 * Per-IP rate limit, backed by one small file per caller.
 *
 * The file is named after a salted SHA-256 of the address, not the address
 * itself, and holds nothing but a window start and a counter. That keeps the
 * limiter from quietly becoming a log of who visited the site.
 *
 * Fails open. If the counter directory is unwritable the honeypot and the
 * Origin check still stand, and dropping real enquiries because a directory
 * broke is the worse failure for the agency.
 */
function rateLimitAllows(string $directory, string $ip, string $salt, int $max, int $windowSeconds): bool
{
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        return true;
    }

    $path = $directory . '/' . hash('sha256', $salt . '|' . $ip);
    $handle = @fopen($path, 'c+');
    if ($handle === false) {
        return true;
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        return true;
    }

    $now = time();
    $windowStart = $now;
    $count = 0;

    $contents = stream_get_contents($handle);
    if (is_string($contents) && preg_match('/^(\d+) (\d+)$/', trim($contents), $matches) === 1) {
        $storedStart = (int) $matches[1];
        if ($storedStart + $windowSeconds > $now) {
            $windowStart = $storedStart;
            $count = (int) $matches[2];
        }
    }

    $count++;
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, $windowStart . ' ' . $count);
    flock($handle, LOCK_UN);
    fclose($handle);

    // Occasionally sweep expired counters, so the directory neither grows
    // without bound nor retains a hash longer than it is useful.
    if (mt_rand(1, 50) === 1) {
        $entries = @scandir($directory);
        if (is_array($entries)) {
            foreach ($entries as $entry) {
                if ($entry === '.' || $entry === '..') {
                    continue;
                }
                $candidate = $directory . '/' . $entry;
                $modified = @filemtime($candidate);
                if ($modified !== false && $modified + ($windowSeconds * 2) < $now) {
                    @unlink($candidate);
                }
            }
        }
    }

    return $count <= $max;
}

/**
 * Read one SMTP reply, following continuation lines, and return its code.
 *
 * @param resource $socket
 * @throws SmtpError
 */
function smtpRead($socket): int
{
    $code = 0;

    while (true) {
        $line = fgets($socket, 515);
        if ($line === false) {
            throw new SmtpError('read');
        }

        $meta = stream_get_meta_data($socket);
        if (!empty($meta['timed_out'])) {
            throw new SmtpError('timeout');
        }

        if ($code === 0) {
            $code = (int) substr($line, 0, 3);
        }

        // "250-EXTENSION" is a continuation; "250 OK" ends the reply.
        if (strlen($line) < 4 || $line[3] !== '-') {
            break;
        }
    }

    return $code;
}

/**
 * Send one command and assert the reply code.
 *
 * @param resource $socket
 * @throws SmtpError
 */
function smtpCommand($socket, string $command, int $expected, string $stage)
{
    if (fwrite($socket, $command . "\r\n") === false) {
        throw new SmtpError($stage);
    }
    if (smtpRead($socket) !== $expected) {
        throw new SmtpError($stage);
    }
}

/**
 * Deliver one already-assembled message over SMTP.
 *
 * @param array<string,mixed> $config
 * @throws SmtpError
 */
function smtpSend(array $config, string $envelopeFrom, string $recipient, string $message)
{
    $security = $config['smtp_security'];
    $timeout = (int) $config['smtp_timeout'];

    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'SNI_enabled' => true,
        ],
    ]);

    $transport = ($security === 'tls') ? 'ssl://' : 'tcp://';
    $errno = 0;
    $errstr = '';
    $socket = @stream_socket_client(
        $transport . $config['smtp_host'] . ':' . $config['smtp_port'],
        $errno,
        $errstr,
        $timeout,
        STREAM_CLIENT_CONNECT,
        $context
    );
    if ($socket === false) {
        throw new SmtpError('connect');
    }

    stream_set_timeout($socket, $timeout);

    try {
        if (smtpRead($socket) !== 220) {
            throw new SmtpError('greeting');
        }

        $helo = $config['smtp_helo'];
        smtpCommand($socket, 'EHLO ' . $helo, 250, 'ehlo');

        if ($security === 'starttls') {
            smtpCommand($socket, 'STARTTLS', 220, 'starttls');

            $crypto = STREAM_CRYPTO_METHOD_TLS_CLIENT;
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
                $crypto |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            }
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
                $crypto |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
            }
            if (@stream_socket_enable_crypto($socket, true, $crypto) !== true) {
                throw new SmtpError('tls');
            }

            // The extension list is renegotiated after the upgrade.
            smtpCommand($socket, 'EHLO ' . $helo, 250, 'ehlo-tls');
        }

        if ($config['smtp_username'] !== '') {
            smtpCommand($socket, 'AUTH LOGIN', 334, 'auth');
            smtpCommand($socket, base64_encode($config['smtp_username']), 334, 'auth-user');
            smtpCommand($socket, base64_encode($config['smtp_password']), 235, 'auth-pass');
        }

        smtpCommand($socket, 'MAIL FROM:<' . $envelopeFrom . '>', 250, 'mail-from');
        smtpCommand($socket, 'RCPT TO:<' . $recipient . '>', 250, 'rcpt-to');
        smtpCommand($socket, 'DATA', 354, 'data');

        // The body is base64, so no line can begin with a period and dot
        // stuffing is unnecessary. Headers are ASCII and fixed.
        if (fwrite($socket, $message . "\r\n.\r\n") === false) {
            throw new SmtpError('body');
        }
        if (smtpRead($socket) !== 250) {
            throw new SmtpError('accept');
        }

        @fwrite($socket, "QUIT\r\n");
    } finally {
        @fclose($socket);
    }
}

// ---------------------------------------------------------------------------
// Request handling
// ---------------------------------------------------------------------------

try {
    if ((isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '') !== 'POST') {
        header('Allow: POST');
        respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
    }

    $configPath = __DIR__ . '/../../contact-config.php';
    if (!is_file($configPath)) {
        respond(500, ['ok' => false, 'error' => 'server_misconfigured']);
    }
    $config = require $configPath;
    if (!is_array($config)) {
        respond(500, ['ok' => false, 'error' => 'server_misconfigured']);
    }

    // NOTE (2026-08-25): 'recipient' lives in contact-config.php on the host,
    // outside this repository, so its live value cannot be reviewed here.
    // It MUST be biuro@e-perfecthouse.pl in production. While it points anywhere
    // else — in particular a developer's Gmail address used for post-deploy
    // testing — the published privacy policy is untrue: §5 states that contact
    // form data is not transferred outside the EEA, and a Google-hosted mailbox
    // is both an undisclosed recipient and a US transfer.
    // Tracked as [P-8] in docs/rodo-compliance/processors.md. Switch it back
    // immediately after smoke-testing a deployment, and re-verify with one test
    // submission.
    $config = array_merge([
        'allowed_origins' => [],
        'recipient' => '',
        'from_email' => '',
        'from_name' => 'Formularz e-perfecthouse.pl',
        'smtp_host' => 'localhost',
        'smtp_port' => 587,
        'smtp_security' => 'starttls',
        'smtp_username' => '',
        'smtp_password' => '',
        'smtp_helo' => 'e-perfecthouse.pl',
        'smtp_timeout' => 15,
        'rate_limit_dir' => __DIR__ . '/../../contact-ratelimit',
        'rate_limit_salt' => '',
        'rate_limit_max' => 5,
        'rate_limit_window' => 3600,
        'error_log_path' => defaultErrorLogPath(),
        'error_log_max_bytes' => 262144,
    ], $config);

    if ($config['recipient'] === '' || $config['from_email'] === '' || $config['rate_limit_salt'] === '') {
        respond(500, ['ok' => false, 'error' => 'server_misconfigured']);
    }

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if ($origin === '' || !in_array($origin, $config['allowed_origins'], true)) {
        respond(403, ['ok' => false, 'error' => 'forbidden_origin']);
    }

    // Requiring a JSON content type means a cross-site HTML form cannot reach
    // this handler at all: it would need a preflight, which the Origin check
    // above already refuses.
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
    if (stripos($contentType, 'application/json') === false) {
        respond(415, ['ok' => false, 'error' => 'unsupported_media_type']);
    }

    $declaredLength = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : 0;
    if ($declaredLength > MAX_BODY_BYTES) {
        respond(413, ['ok' => false, 'error' => 'payload_too_large']);
    }

    $raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
    if ($raw === false) {
        respond(400, ['ok' => false, 'error' => 'invalid_payload']);
    }
    if (strlen($raw) > MAX_BODY_BYTES) {
        respond(413, ['ok' => false, 'error' => 'payload_too_large']);
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        respond(400, ['ok' => false, 'error' => 'invalid_payload']);
    }

    // Honeypot. Answering with a 200 keeps a bot from learning that the field
    // is what gave it away; nothing is sent.
    $honeypot = isset($data['website']) ? $data['website'] : '';
    if (!is_string($honeypot) || trim($honeypot) !== '') {
        respond(200, ['ok' => true]);
    }

    $personalSource = isset($data['personalData']) && is_array($data['personalData']) ? $data['personalData'] : null;
    $propertySource = isset($data['propertyDetails']) && is_array($data['propertyDetails']) ? $data['propertyDetails'] : [];
    if ($personalSource === null) {
        respond(400, ['ok' => false, 'error' => 'invalid_payload']);
    }

    try {
        $name = field($personalSource, 'name', LIMITS['name']);
        $phone = field($personalSource, 'phoneNumber', LIMITS['phoneNumber']);
        $email = field($personalSource, 'email', LIMITS['email']);

        if ($name === '' || $phone === '' || $email === '') {
            throw new InvalidField('required');
        }
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidField('email');
        }

        $property = [];
        foreach (PROPERTY_LABELS as $key => $label) {
            // Both form groups are submitted regardless of which inputs the
            // route actually displayed, so empty is normal, not an error.
            $property[$key] = field($propertySource, $key, LIMITS['property']);
        }

        $typ = field($data, 'typ', 20);
        if ($typ !== 'sprzedam' && $typ !== 'szukam') {
            $typ = 'szukam';
        }
    } catch (InvalidField $exception) {
        respond(422, ['ok' => false, 'error' => 'invalid_field']);
    }

    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
    $withinLimit = rateLimitAllows(
        $config['rate_limit_dir'],
        $ip,
        $config['rate_limit_salt'],
        (int) $config['rate_limit_max'],
        (int) $config['rate_limit_window']
    );
    if (!$withinLimit) {
        header('Retry-After: ' . (int) $config['rate_limit_window']);
        respond(429, ['ok' => false, 'error' => 'rate_limited']);
    }

    $heading = ($typ === 'sprzedam')
        ? 'Zgłoszenie: CHCĘ SPRZEDAĆ/WYNAJĄĆ NIERUCHOMOŚĆ'
        : 'Zgłoszenie: SZUKAM NIERUCHOMOŚCI';

    $lines = [$heading, '', 'DANE KONTAKTOWE', 'Imię i nazwisko: ' . $name, 'Telefon: ' . $phone, 'E-mail: ' . $email];

    $propertyLines = [];
    foreach (PROPERTY_LABELS as $key => $label) {
        if ($property[$key] !== '') {
            $propertyLines[] = $label . ': ' . $property[$key];
        }
    }
    if ($propertyLines !== []) {
        $lines[] = '';
        $lines[] = ($typ === 'sprzedam') ? 'NIERUCHOMOŚĆ' : 'POSZUKIWANA NIERUCHOMOŚĆ';
        foreach ($propertyLines as $propertyLine) {
            $lines[] = $propertyLine;
        }
    }

    $lines[] = '';
    $lines[] = '--';
    $lines[] = 'Wiadomość wysłana automatycznie z formularza kontaktowego e-perfecthouse.pl.';
    $lines[] = 'Aby odpowiedzieć nadawcy, użyj funkcji "Odpowiedz" — trafi ona na adres ' . $email . '.';

    $body = implode("\r\n", $lines);

    $subject = ($typ === 'sprzedam' ? 'Nowe zgłoszenie (sprzedaż/wynajem)' : 'Nowe zgłoszenie (poszukiwanie)')
        . ' — ' . $name;

    $domain = substr(strrchr($config['from_email'], '@') ?: '@localhost', 1);

    $headers = [
        'Date: ' . date('r'),
        // The visitor is never the From: address. Sending as the site's own
        // mailbox is what keeps SPF and DKIM aligned and the mail out of spam.
        'From: ' . encodeAddress($config['from_name'], $config['from_email']),
        'To: <' . $config['recipient'] . '>',
        'Reply-To: ' . encodeAddress($name, $email),
        'Subject: ' . encodeHeaderText($subject),
        'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . $domain . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'Auto-Submitted: auto-generated',
    ];

    $message = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($body), 76, "\r\n");

    try {
        smtpSend($config, $config['from_email'], $config['recipient'], $message);
    } catch (SmtpError $exception) {
        // Fail loudly. The client turns this into a visible retry prompt rather
        // than pretending the enquiry was delivered. Only the failed SMTP stage
        // is recorded — never the enquiry itself.
        logFailure((string) $config['error_log_path'], (int) $config['error_log_max_bytes'], 'mail_failed', $exception->getMessage());
        respond(502, ['ok' => false, 'error' => 'mail_failed']);
    }

    respond(200, ['ok' => true]);
} catch (Throwable $exception) {
    // Nothing escapes, and nothing about the enquiry is ever logged — an
    // uncaught throwable's message could in principle echo a field value, so
    // only the exception class and line are recorded, never getMessage().
    $logPath = (isset($config) && is_array($config) && isset($config['error_log_path'])) ? (string) $config['error_log_path'] : defaultErrorLogPath();
    $logMaxBytes = (isset($config) && is_array($config) && isset($config['error_log_max_bytes'])) ? (int) $config['error_log_max_bytes'] : 262144;
    logFailure($logPath, $logMaxBytes, 'internal_error', get_class($exception) . '@' . $exception->getLine());
    respond(500, ['ok' => false, 'error' => 'internal_error']);
}

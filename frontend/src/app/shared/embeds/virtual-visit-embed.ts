// Tour URLs come from the Galactica Virgo feed, so the provider is whatever the
// CRM was pointed at. Only hosts on this list may be framed: every entry is a
// third party that receives the visitor's IP and must be named in the privacy
// policy. Matching is on the parsed hostname, exactly or on a domain suffix --
// never on the raw string, because `https://evil.example/?x=matterport.com`
// passes a substring check.
//
// virgo.galapp.net is the Galactica Virgo tour host, confirmed by the owner
// against a live tour URL on 2026-08-24. Broaden to 'galapp.net' if Galactica
// starts serving tours from other subdomains -- a rejected tour is logged with
// its hostname by parseAllowedVirtualVisitUrl, so the value to add is named in
// the console rather than having to be guessed.
export const VIRTUAL_VISIT_ALLOWED_HOSTS: readonly string[] = [
  'virgo.galapp.net',
];

export function isAllowedVirtualVisitUrl(link: string | null): boolean {
  return !!parseAllowedVirtualVisitUrl(link);
}

export function parseAllowedVirtualVisitUrl(link: string | null): URL | null {
  if (!link) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    reportRejection(link, 'nie jest poprawnym adresem URL');
    return null;
  }
  if (url.protocol !== 'https:') {
    reportRejection(link, `używa protokołu ${url.protocol} zamiast https:`);
    return null;
  }
  if (!isAllowedHost(url.hostname.toLowerCase())) {
    reportRejection(
      link,
      `host ${url.hostname} nie znajduje się na liście dozwolonych dostawców ` +
        `(${VIRTUAL_VISIT_ALLOWED_HOSTS.join(', ') || 'lista jest pusta'})`,
    );
    return null;
  }
  return url;
}

function isAllowedHost(hostname: string): boolean {
  return VIRTUAL_VISIT_ALLOWED_HOSTS.some(
    (allowed) => hostname === allowed || hostname.endsWith('.' + allowed),
  );
}

// A tour that silently disappears is a support ticket nobody can diagnose, so
// say loudly which offer URL was dropped and why.
function reportRejection(link: string, reason: string): void {
  console.warn(
    `[wirtualna wizyta] Pominięto osadzenie: ${reason}. Adres: ${link}`,
  );
}

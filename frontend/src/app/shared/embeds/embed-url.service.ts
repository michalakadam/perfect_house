import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { buildYoutubeEmbedUrl } from './youtube-embed';
import { parseAllowedVirtualVisitUrl } from './virtual-visit-embed';

// The only place in the application allowed to call bypassSecurityTrust*, and
// only ever on a URL that has already been parsed and matched against a known
// origin.
@Injectable({
  providedIn: 'root',
})
export class EmbedUrlService {
  constructor(private readonly sanitizer: DomSanitizer) {}

  youtubeEmbedUrl(link: string | null | undefined): SafeResourceUrl | null {
    const embedUrl = buildYoutubeEmbedUrl(link ?? null);

    return embedUrl
      ? this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
      : null;
  }

  virtualVisitEmbedUrl(
    link: string | null | undefined,
  ): SafeResourceUrl | null {
    const url = parseAllowedVirtualVisitUrl(link ?? null);

    return url
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url.toString())
      : null;
  }
}

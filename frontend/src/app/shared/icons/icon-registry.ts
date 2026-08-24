import { inject, provideAppInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Provider, EnvironmentProviders } from '@angular/core';

/**
 * Ikony SVG hostowane lokalnie, które zastąpiły zestaw Font Awesome
 * ładowany wcześniej z kit.fontawesome.com. Nazwa klucza odpowiada nazwie
 * pliku w assets/icons oraz wartości atrybutu svgIcon w szablonach.
 */
const PERFECT_ICONS = [
  'facebook-square',
  'instagram-square',
  'envelope-square',
  'phone-alt',
  'phone-square-alt',
] as const;

/** Rejestruje ikony SVG w MatIconRegistry przy starcie aplikacji. */
export function providePerfectIcons(): Provider | EnvironmentProviders {
  return provideAppInitializer(() => {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    PERFECT_ICONS.forEach((name) =>
      registry.addSvgIcon(
        name,
        // Ścieżka jest stałą z tego pliku, nie pochodzi z danych wejściowych.
        sanitizer.bypassSecurityTrustResourceUrl(`/assets/icons/${name}.svg`),
      ),
    );
  });
}

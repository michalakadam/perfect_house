import { Component, ChangeDetectionStrategy } from '@angular/core';

/** Stopka strony. Zawiera przydatne linki, informacje kontaktowe i logo firmy. */
@Component({
  selector: 'perfect-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}

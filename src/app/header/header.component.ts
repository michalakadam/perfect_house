import { Component, ChangeDetectionStrategy } from '@angular/core';

/** Nagłówek strony. Zawiera logo firmy, numer telefonu oraz nawigację. */
@Component({
  selector: 'perfect-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}

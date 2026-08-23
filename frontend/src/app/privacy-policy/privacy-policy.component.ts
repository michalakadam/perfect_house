import { Component, ChangeDetectionStrategy } from '@angular/core';

/** Strona 'Polityka prywatności'. Zawiera pełną informację o przetwarzaniu
 * danych osobowych zgodnie z art. 13 RODO. */
@Component({
  selector: 'perfect-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PrivacyPolicyComponent {}

import { Component, ChangeDetectionStrategy } from '@angular/core';

/** Kontener strony 'Kontakt'. Zawiera:
 * - informacje kontaktowe
 * - mapę pokazującą lokalizację biura
 * - formularz, poprzez który klient może skontaktować się z biurem
*/
@Component({
  selector: 'perfect-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {}

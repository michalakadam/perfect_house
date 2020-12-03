import { Component, ChangeDetectionStrategy } from '@angular/core';

/** Pozwala klientowi na wysłanie wiadomości do biura lub bezpośrednio do agenta. */
@Component({
  selector: 'perfect-customer-message',
  templateUrl: './customer-message.component.html',
  styleUrls: ['./customer-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerMessageComponent {}

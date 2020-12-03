import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'perfect-customer-message',
  templateUrl: './customer-message.component.html',
  styleUrls: ['./customer-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerMessageComponent {}

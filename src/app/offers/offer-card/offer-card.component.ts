import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Offer } from 'src/app/shared/models';

@Component({
  selector: 'perfect-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferCardComponent {
  @Input() offer: Offer;
}

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Offer } from 'src/app/shared/models';

@Component({
  selector: 'perfect-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OfferDetailsComponent {
  @Input() offer: Offer;
}

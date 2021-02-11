import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Offer } from 'src/app/shared/models';

@Component({
  selector: 'perfect-offer-characteristics',
  templateUrl: './offer-characteristics.component.html',
  styleUrls: ['./offer-characteristics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferCharacteristicsComponent {
  @Input() offer: Offer;
}

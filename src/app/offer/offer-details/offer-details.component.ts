import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Offer } from 'src/app/shared/models';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'perfect-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OfferDetailsComponent {
  isOnOfferPage = false;
  
  @Input() offer: Offer;
  @Input()
  set onOfferPage(value: boolean) {
    this.isOnOfferPage = coerceBooleanProperty(value);
  }

  exists(value: any): boolean {
    if (typeof value === 'number') {
      return value > -1;
    }
    return !!value;  
  }
}

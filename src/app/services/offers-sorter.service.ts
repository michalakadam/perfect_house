import { Injectable } from '@angular/core';
import { Offer } from '../shared/models/offer';
import { Sorting } from '../shared/models/sorting';

@Injectable({
  providedIn: 'root'
})
export class OffersSorter {

  sortOffers(offers: Offer[], sorting: Sorting): Offer[] {
    if (sorting.isAscending) {
      return offers.sort((a, b) => this.compareByPropertyAsc(sorting.propertyName, a, b));
    }
    return offers.sort((a, b) => this.compareByPropertyDesc(sorting.propertyName, a, b));
  }

  private compareByPropertyAsc(propertyName: string, offerA: Offer, offerB: Offer): number {
    if (offerA[propertyName] < offerB[propertyName]) {
      return -1;
    }
    if (offerA[propertyName] > offerB[propertyName]) {
      return 1;
    }
    return 0;
  }

  private compareByPropertyDesc(propertyName: string, offerA: Offer, offerB: Offer): number {
    if (offerA[propertyName] > offerB[propertyName]) {
      return -1;
    }
    if (offerA[propertyName] < offerB[propertyName]) {
      return 1;
    }
    return 0;
  }
}

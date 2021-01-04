import { Injectable } from '@angular/core';
import { Offer, OffersFilters } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class OffersFilter {

  filterOffers(offers: Offer[], filters: OffersFilters): Offer[] {
    if (filters.estateType) {
      offers = this.filterByEstateType(offers, filters.estateType);
    }
    offers = this.filterByTransactionType(offers, filters.isForRent);
    offers = this.filterByMarketType(
      offers, filters.isPrimaryMarket, filters.isSecondaryMarket);
    if (filters.voivodeship && filters.voivodeship !== 'cała Polska') {
      offers = this.filterByVoivodeship(offers, filters.voivodeship);
    }
    if (filters.location) {
      offers = this.filterByLocation(offers, filters.location);
    }

    return offers;
  }

  private filterByEstateType(offers: Offer[], estateType: string): Offer[] {
    return offers.filter(offer => offer.estateType === estateType);
  }

  private filterByTransactionType(offers: Offer[], isForRent): Offer[] {
    return offers.filter(offer => offer.isForRent === isForRent);
  }

  private filterByMarketType(
    offers: Offer[], isPrimaryMarket: boolean, isSecondaryMarket: boolean): Offer[] {
    if (isPrimaryMarket && isSecondaryMarket) {
      return offers;
    }
    if (!isPrimaryMarket && !isSecondaryMarket) {
      return [];
    }
    if (isPrimaryMarket) {
      return offers.filter(offer => offer.isMarketPrimary);
    }
    return offers.filter(offer => !offer.isMarketPrimary);
  }

  private filterByVoivodeship(offers: Offer[], voivodeship: string): Offer[] {
    return offers.filter(offer => 
      offer.voivodeship.toLowerCase() === voivodeship.toLowerCase());
  }

  private filterByLocation(offers: Offer[], location: string): Offer[] {
    return offers.filter(offer =>
      offer.city.toLowerCase() === location.toLowerCase());
  }
}

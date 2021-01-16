import { Injectable } from '@angular/core';
import { AVAILABLE_ESTATE_TYPES, Offer, OffersFilters } from '../shared/models';

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
    if (filters.isInvestment) {
      offers = offers.filter(offer => 
        offer.predestination && offer.predestination.includes('inwestycyjna'));
    }
    if (filters.isByTheSea) {
      // TODO: find out which flag is used in Galactica for this kind of offers.
      return [];
    }
    if (filters.isNoCommission) {
      offers = offers.filter(offer => offer.isNoCommission);
    }
    if (filters.isVirtualVisitAvailable) {
      offers = offers.filter(offer => !!offer.virtualVisitUrl);
    }
    if (filters.pricePerSquareMeterFrom > -1) {
      offers = offers.filter(offer => 
        offer.pricePerSquareMeter >= filters.pricePerSquareMeterFrom);
    }
    if (filters.pricePerSquareMeterTo > -1) {
      offers = offers.filter(offer => 
        offer.pricePerSquareMeter <= filters.pricePerSquareMeterTo);
    }
    if (filters.areaFrom > -1) {
      offers = offers.filter(offer => offer.totalArea >= filters.areaFrom);
    }
    if (filters.areaTo > -1) {
      offers = offers.filter(offer => offer.totalArea <= filters.areaTo);
    }
    if (filters.numberOfRoomsFrom > -1) {
      offers = offers.filter(offer => offer.numberOfRooms >= filters.numberOfRoomsFrom);
    }
    if (filters.numberOfRoomsTo > -1) {
      offers = offers.filter(offer => offer.numberOfRooms <= filters.numberOfRoomsTo);
    }
    if (filters.floorFrom > -1) {
      offers = offers.filter(offer => offer.floor >= filters.floorFrom);
    }
    if (filters.floorTo > -1) {
      offers = offers.filter(offer => offer.floor <= filters.floorTo);
    }
    
    return offers;
  }

  private filterByEstateType(offers: Offer[], estateType: string): Offer[] {
    if (estateType === 'wszystkie') {
      return offers;
    }
    const estate = AVAILABLE_ESTATE_TYPES
      .find(estate => estate.displayName === estateType);

    return estate ? offers.filter(offer => offer.estateType === estate.queryName) : [];
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


  filterOffersByPrice(offers: Offer[], filters: OffersFilters): Offer[] {
    if (filters.priceFrom > -1) {
      offers = offers.filter(offer => offer.price >= filters.priceFrom);
    }
    if (filters.priceTo > -1) {
      offers = offers.filter(offer => offer.price <= filters.priceTo);
    }
    return offers;
  }
}

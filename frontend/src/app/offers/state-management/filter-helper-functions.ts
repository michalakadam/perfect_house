import {
  AVAILABLE_ESTATE_TYPES,
  Offer,
  OffersFilters,
} from 'src/app/shared/models';

export const filterOffers = (
  offers: Offer[],
  filters: OffersFilters,
): Offer[] => {
  if (!filters) {
    return offers;
  }
  if (filters.estateType) {
    offers = filterByEstateType(offers, filters.estateType);
    if (filters.estateSubtype) {
      offers = filterByEstateSubtype(
        offers,
        filters.estateType,
        filters.estateSubtype,
      );
    }
  }
  offers = filterByTransactionType(offers, filters.isForRent);
  offers = filterByMarketType(
    offers,
    filters.isPrimaryMarket,
    filters.isSecondaryMarket,
  );
  if (filters.voivodeship) {
    offers = filterByVoivodeship(offers, filters.voivodeship);
  }
  if (filters.county) {
    offers = filterByCounty(offers, filters.county);
  }
  if (filters.location) {
    offers = filterByLocation(offers, filters.location);
  }
  if (filters.isInvestment) {
    offers = offers.filter(
      (offer) =>
        offer.estateSubtypes &&
        offer.estateSubtypes.indexOf('inwestycyjna') > -1,
    );
  }
  if (filters.isByTheSea) {
    offers = offers.filter((offer) => offer.isByTheSea);
  }
  if (filters.isNoCommission) {
    offers = offers.filter((offer) => offer.isNoCommission);
  }
  if (filters.isVirtualVisitAvailable) {
    offers = offers.filter((offer) => !!offer.virtualVisitUrl);
  }
  if (filters.pricePerSquareMeterFrom > -1) {
    offers = offers.filter(
      (offer) =>
        offer.pricePerSquareMeter.value >= filters.pricePerSquareMeterFrom,
    );
  }
  if (filters.pricePerSquareMeterTo > -1) {
    offers = offers.filter(
      (offer) =>
        offer.pricePerSquareMeter.value <= filters.pricePerSquareMeterTo,
    );
  }
  if (filters.areaFrom > -1) {
    offers = offers.filter(
      (offer) => offer.totalArea.value >= filters.areaFrom,
    );
  }
  if (filters.areaTo > -1) {
    offers = offers.filter((offer) => offer.totalArea.value <= filters.areaTo);
  }
  if (filters.numberOfRoomsFrom > -1) {
    offers = offers.filter(
      (offer) => offer.numberOfRooms.value >= filters.numberOfRoomsFrom,
    );
  }
  if (filters.numberOfRoomsTo > -1) {
    offers = offers.filter(
      (offer) => offer.numberOfRooms.value <= filters.numberOfRoomsTo,
    );
  }
  if (filters.floorFrom > -1) {
    offers = offers.filter((offer) => offer.floor.value >= filters.floorFrom);
  }
  if (filters.floorTo > -1) {
    offers = offers.filter((offer) => offer.floor.value <= filters.floorTo);
  }
  if (filters.isElevatorAvailable) {
    offers = offers.filter((offer) => offer.isElevatorAvailable.value);
  }
  if (filters.isParkingAvailable) {
    offers = offers.filter(
      (offer) =>
        offer.isParkingAvailable.value ||
        !!offer.garage.value ||
        offer.isTruckParkingAvailable.value,
    );
  }
  if (filters.isTerraceAvailable) {
    offers = offers.filter((offer) => offer.isTerraceAvailable.value);
  }
  if (filters.isBasementAvailable) {
    offers = offers.filter((offer) => offer.isBasementAvailable.value);
  }
  if (filters.isMpzpAvailable) {
    offers = offers.filter((offer) => !!offer.mpzp.value);
  }

  return offers;
};

const filterByEstateType = (offers: Offer[], estateType: string): Offer[] => {
  const estate = AVAILABLE_ESTATE_TYPES.find(
    (estate) => estate.displayName === estateType,
  );

  return estate
    ? offers.filter((offer) => offer.estateType === estate.queryName)
    : [];
};

const filterByEstateSubtype = (
  offers: Offer[],
  estateType: string,
  estateSubtype: string,
): Offer[] => {
  if (estateType === 'mieszkanie') {
    return offers.filter((offer) => offer.buildingType.value === estateSubtype);
  }
  return offers.filter(
    (offer) => offer.estateSubtypes.indexOf(estateSubtype) > -1,
  );
};

const filterByTransactionType = (offers: Offer[], isForRent): Offer[] => {
  return offers.filter((offer) => offer.isForRent === isForRent);
};

const filterByMarketType = (
  offers: Offer[],
  isPrimaryMarket: boolean,
  isSecondaryMarket: boolean,
): Offer[] => {
  if (isPrimaryMarket && isSecondaryMarket) {
    return offers;
  }
  if (!isPrimaryMarket && !isSecondaryMarket) {
    return [];
  }
  if (isPrimaryMarket) {
    return offers.filter((offer) => offer.isMarketPrimary);
  }
  return offers.filter((offer) => !offer.isMarketPrimary);
};

export const filterByVoivodeship = (
  offers: Offer[],
  voivodeship: string,
): Offer[] => {
  return offers.filter(
    (offer) => offer.voivodeship.toLowerCase() === voivodeship.toLowerCase(),
  );
};

export const filterByCounty = (offers: Offer[], county: string): Offer[] => {
  return offers.filter(
    (offer) => offer.county.toLowerCase() === county.toLowerCase(),
  );
};

const filterByLocation = (offers: Offer[], location: string): Offer[] => {
  if (location.includes(',')) {
    return offers.filter(
      (offer) => offer.fullLocation.toLowerCase() === location.toLowerCase(),
    );
  }
  return offers.filter(
    (offer) =>
      offer.city.toLowerCase() === location.toLowerCase() ||
      offer.district.toLowerCase() === location.toLowerCase(),
  );
};

export const filterOffersByPrice = (
  offers: Offer[],
  filters: OffersFilters,
): Offer[] => {
  if (!filters) {
    return offers;
  }
  if (filters.priceFrom > -1) {
    offers = offers.filter((offer) => offer.price >= filters.priceFrom);
  }
  if (filters.priceTo > -1) {
    offers = offers.filter((offer) => offer.price <= filters.priceTo);
  }
  return offers;
};

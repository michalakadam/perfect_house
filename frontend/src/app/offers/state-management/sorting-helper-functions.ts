import { Offer, Sorting } from "src/app/shared/models";

export const sortOffers = (offers: Offer[], sorting: Sorting): Offer[] => {
  if (sorting.isAscending) {
    return [...offers].sort((a, b) =>
      compareByPropertyAsc(sorting.propertyName, a, b)
    );
  }
  return [...offers].sort((a, b) =>
    compareByPropertyDesc(sorting.propertyName, a, b)
  );
};

const compareByPropertyAsc = (
  propertyName: string,
  offerA: Offer,
  offerB: Offer
): number => {
  const propertyA = getPropertyValue(offerA, propertyName);
  const propertyB = getPropertyValue(offerB, propertyName);
  if (propertyA < propertyB) {
    return -1;
  }
  if (propertyA > propertyB) {
    return 1;
  }
  return 0;
};

const compareByPropertyDesc = (
  propertyName: string,
  offerA: Offer,
  offerB: Offer
): number => {
  const propertyA = getPropertyValue(offerA, propertyName);
  const propertyB = getPropertyValue(offerB, propertyName);
  if (propertyA > propertyB) {
    return -1;
  }
  if (propertyA < propertyB) {
    return 1;
  }
  return 0;
};

const getPropertyValue = (offer: Offer, propertyName: string) => {
  const offerFieldPropertyNames = ['pricePerSquareMeter', 'totalArea'];
  if (offerFieldPropertyNames.includes(propertyName)) {
    return offer[propertyName].value;
  }
  return offer[propertyName];
}

export const sortAlphabetically = (a: string, b: string): number => {
  return a.localeCompare(b, "pl");
};

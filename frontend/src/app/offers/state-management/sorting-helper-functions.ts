import { Injectable } from "@angular/core";
import { Offer, Sorting } from "src/app/shared/models";

export const sortOffers = (offers: Offer[], sorting: Sorting): Offer[] => {
  if (sorting.isAscending) {
    return offers.sort((a, b) =>
      compareByPropertyAsc(sorting.propertyName, a, b)
    );
  }
  return offers.sort((a, b) =>
    compareByPropertyDesc(sorting.propertyName, a, b)
  );
};

const compareByPropertyAsc = (
  propertyName: string,
  offerA: Offer,
  offerB: Offer
): number => {
  if (offerA[propertyName] < offerB[propertyName]) {
    return -1;
  }
  if (offerA[propertyName] > offerB[propertyName]) {
    return 1;
  }
  return 0;
};

const compareByPropertyDesc = (
  propertyName: string,
  offerA: Offer,
  offerB: Offer
): number => {
  if (offerA[propertyName] > offerB[propertyName]) {
    return -1;
  }
  if (offerA[propertyName] < offerB[propertyName]) {
    return 1;
  }
  return 0;
};

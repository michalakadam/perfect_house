import {
  Offer,
  Sorting,
  OffersFilters,
  AVAILABLE_ESTATE_TYPES,
} from "src/app/shared/models";
import { OFFERS_PER_PAGE } from "src/app/shared/constants";
import {
  filterByCounty,
  filterByVoivodeship,
  filterOffers,
  filterOffersByPrice,
} from "./filter-helper-functions";
import { sortAlphabetically, sortOffers } from "./sorting-helper-functions";

export const computeMainPageOffers = (offers: Offer[]) => {
  const shuffleOffers = (offers: Offer[]): Offer[] => {
    for (let i = offers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [offers[i], offers[j]] = [offers[j], offers[i]];
    }
    return offers;
  };

  return shuffleOffers(offers.filter((offer) => offer.isExclusive));
};

export const computeCurrentSearchOffers = (
  sorting: Sorting,
  filters: OffersFilters,
  allOffers: Offer[]
) => {
  let currentSearchOffers = sortOffers(
    filterOffers(allOffers, filters),
    sorting
  );
  // Filtering by price needs to be done at the end in order to retrieve price slider
  // min/max value properly.
  return filterOffersByPrice(currentSearchOffers, filters);
};

export const computeOffersForCurrentPage = (offers: Offer[], page: number) => {
  const startIndex = page * OFFERS_PER_PAGE;

  return offers.slice(startIndex, startIndex + OFFERS_PER_PAGE);
};

export const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

export const computeDistinctLocations = (
  offers: Offer[],
  voivodeship: string,
  county: string
): string[] => {
  if (voivodeship) {
    offers = filterByVoivodeship(offers, voivodeship);
  }
  if (county) {
    offers = filterByCounty(offers, county);
  }

  const gminy = offers
    .map((offer) => offer.city)
    .filter((city) => city.includes("(gmina)"))
    .filter(onlyUnique)
    .sort(sortAlphabetically);
  const cities = offers
    .map((offer) => offer.fullLocation)
    .filter(onlyUnique)
    .sort(sortAlphabetically);

  return [...gminy, ...cities];
};

export const computeVoivodeshipsWithCounties = (
  offers: Offer[]
): Map<string, string[]> => {
  const result = new Map<string, string[]>();
  for (const voivodeship of computeAvailableVoivodeships(offers)) {
    result.set(voivodeship, computeCountiesForVoivodeship(offers, voivodeship));
  }
  return result;
};

const computeAvailableVoivodeships = (offers: Offer[]): string[] => {
  return offers
    .map((offer) => offer.voivodeship)
    .filter(onlyUnique)
    .filter((v) => !v.includes("Attyka") && !v.includes("Costa"))
    .sort(sortAlphabetically);
};

const computeCountiesForVoivodeship = (
  offers: Offer[],
  voivodeship: string
): string[] => {
  return offers
    .filter((offer) => offer.voivodeship === voivodeship)
    .map((offer) => offer.county)
    .filter(onlyUnique)
    .filter(Boolean)
    .sort(sortAlphabetically);
};

export const computeEstateTypesWithSubtypes = (
  offers: Offer[]
): Map<string, string[]> => {
  const result = new Map<string, string[]>();
  for (const estateType of AVAILABLE_ESTATE_TYPES) {
    result.set(
      estateType.displayName,
      estateType.displayName === "mieszkanie"
        ? computeBuildingTypesForEstateType(offers, estateType.queryName)
        : computeEstateSubtypesForEstateType(offers, estateType.queryName)
    );
  }
  return result;
};

const computeBuildingTypesForEstateType = (
  offers: Offer[],
  estateType: string
): string[] => {
  return offers
    .filter((offer) => offer.estateType === estateType)
    .map((offer) => offer.buildingType.value)
    .filter(onlyUnique)
    .filter(Boolean)
    .sort(sortAlphabetically);
};

const computeEstateSubtypesForEstateType = (
  offers: Offer[],
  estateType: string
): string[] => {
  return offers
    .filter((offer) => offer.estateType === estateType)
    .flatMap((offer) => offer.estateSubtypes)
    .filter(onlyUnique)
    .filter(Boolean)
    .map((subtype) =>
      subtype.toLowerCase().replace("_", " ").replace(" - ", "-")
    )
    .sort(sortAlphabetically);
};

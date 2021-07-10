import { createFeatureSelector, createSelector } from "@ngrx/store";
import { OFFERS_PER_PAGE } from "src/app/shared/constants";
import { AVAILABLE_SORTINGS, Offer } from "src/app/shared/models";
import { OffersState } from "./reducers";
import { sortOffers } from "./sorting-helper-functions";
import {
  computeDistinctLocations,
  computeEstateTypesWithSubtypes,
  computeNumberOfPages,
  computeOffersForCurrentPage,
  computeVoivodeshipsWithCounties,
} from "./state-helper-functions";
import { stateKey } from "./reducers";

const selectOffersState = createFeatureSelector<OffersState>(stateKey);

export const getIsLoading = createSelector(
  selectOffersState,
  (state: OffersState) => state.isLoading
);

export const getIsSearching = createSelector(
  selectOffersState,
  (state: OffersState) => state.isSearching
);

const getAllOffers = createSelector(
  selectOffersState,
  (state: OffersState) => state.allOffers
);

export const getOffersForMainPage = createSelector(
  selectOffersState,
  (state: OffersState) => state.mainPageOffers
);

const getCurrentSearchOffers = createSelector(
  selectOffersState,
  (state: OffersState) => state.currentSearchOffers
);

export const getCurrentSearchOffersQuantity = createSelector(
  getCurrentSearchOffers,
  (currentSearchOffers: Offer[]) => currentSearchOffers.length
);

export const getPageNumber = createSelector(
  selectOffersState,
  (state: OffersState) => state.pageNumber
);

export const getSorting = createSelector(
  selectOffersState,
  (state: OffersState) => state.sorting
);

export const getFilters = createSelector(
  selectOffersState,
  (state: OffersState) => state.filters
);

export const getOffersForCurrentPage = createSelector(
  getCurrentSearchOffers,
  getPageNumber,
  (currentSearchOffers: Offer[], pageNumber: number) => {
    return computeOffersForCurrentPage(currentSearchOffers, pageNumber);
  }
);

const getCurrentSearchOffersSortedByPriceAsc = createSelector(
  getCurrentSearchOffers,
  (currentSearchOffers: Offer[]) => {
    return sortOffers(
      currentSearchOffers,
      AVAILABLE_SORTINGS.find(
        (sorting) => sorting.displayName === "cenie rosnąco"
      )
    );
  }
);

export const getLowestPriceForCurrentSearch = createSelector(
  getCurrentSearchOffersSortedByPriceAsc,
  (offersSortedByPriceAsc: Offer[]) => {
    return offersSortedByPriceAsc.length ? offersSortedByPriceAsc[0].price : 0;
  }
);

export const getHighestPriceForCurrentSearch = createSelector(
  getCurrentSearchOffersSortedByPriceAsc,
  (offersSortedByPriceAsc: Offer[]) => {
    return offersSortedByPriceAsc.length
      ? offersSortedByPriceAsc[offersSortedByPriceAsc.length - 1].price
      : 0;
  }
);

export const getNumberOfPages = createSelector(
  getCurrentSearchOffers,
  (currentSearchOffers: Offer[]) => {
    return computeNumberOfPages(currentSearchOffers);
  }
);

export const getDistinctLocations = (voivodeship: string, county: string) =>
  createSelector(getCurrentSearchOffers, (currentSearchOffers: Offer[]) => {
    return computeDistinctLocations(currentSearchOffers, voivodeship, county);
  });

export const getOfferBySymbol = (symbol: string) =>
  createSelector(getAllOffers, (allOffers: Offer[]) => {
    return allOffers.find((offer) => offer.symbol === symbol);
  });

export const getOfferByNumber = (number: number) =>
  createSelector(getAllOffers, (allOffers: Offer[]) => {
    return allOffers.find((offer) => offer.number === number);
  });

export const getVoivodeshipsWithCounties = createSelector(
  getAllOffers,
  (currentSearchOffers: Offer[]) => {
    return computeVoivodeshipsWithCounties(currentSearchOffers);
  }
);

export const getEstateTypesWithSubtypes = createSelector(
  getAllOffers,
  (currentSearchOffers: Offer[]) => {
    return computeEstateTypesWithSubtypes(currentSearchOffers);
  }
);

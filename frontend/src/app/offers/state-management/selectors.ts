import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  AVAILABLE_SORTINGS,
  Offer,
  OffersFilters,
} from "src/app/shared/models";
import { OffersState } from "./reducers";
import { sortOffers } from "./sorting-helper-functions";
import {
  computeAgentOffers,
  computeDistinctLocations,
  computeEstateTypesWithSubtypes,
  computeNumberOfPages,
  computeOffersForCurrentPage,
  computeVoivodeshipsWithCounties,
} from "./state-helper-functions";
import { stateKey } from "./reducers";
import { filterOffers } from "./filter-helper-functions";

const selectOffersState = createFeatureSelector<OffersState>(stateKey);

export const getIsLoading = createSelector(
  selectOffersState,
  (state: OffersState) => state.isLoading
);

export const getIsSearching = createSelector(
  selectOffersState,
  (state: OffersState) => state.isSearching
);

export const getIsCurrentOfferLoading = createSelector(
  selectOffersState,
  (state: OffersState) => !state.currentOffer
);

export const getCurrentOffer = createSelector(
  selectOffersState,
  (state: OffersState) => state.currentOffer
);

export const getAllOffers = createSelector(
  selectOffersState,
  (state: OffersState) => state.allOffers
);

export const getOffersForMainPage = createSelector(
  selectOffersState,
  (state: OffersState) => state.mainPageOffers
);

export const getCurrentSearchOffers = createSelector(
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
  getAllOffers,
  getFilters,
  (allOffers: Offer[], filters: OffersFilters) => {
    return sortOffers(
      filterOffers(allOffers, filters),
      AVAILABLE_SORTINGS.find(
        (sorting) => sorting.displayName === "cenie rosnąco"
      )
    );
  }
);

export const getLowestPriceForCurrentSearch = createSelector(
  getCurrentSearchOffersSortedByPriceAsc,
  (offersSortedByPriceAsc: Offer[]) => {
    return offersSortedByPriceAsc.length ? offersSortedByPriceAsc[0].price : -1;
  }
);

export const getHighestPriceForCurrentSearch = createSelector(
  getCurrentSearchOffersSortedByPriceAsc,
  (offersSortedByPriceAsc: Offer[]) => {
    return offersSortedByPriceAsc.length
      ? offersSortedByPriceAsc[offersSortedByPriceAsc.length - 1].price
      : -1;
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

export const getOffersCountByAgentId = (agentId: number) =>
  createSelector(getAllOffers, (offers: Offer[]) => {
    return computeAgentOffers(offers, agentId).length;
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

export const getCurrentOfferIndex = createSelector(
  getCurrentSearchOffers,
  getCurrentOffer,
  (currentSearchOffers: Offer[], currentOffer: Offer) => {
    if (!currentSearchOffers.length || !currentOffer?.symbol) {
      return -1;
    }
    return currentSearchOffers
      .map((offer) => offer.symbol)
      .indexOf(currentOffer.symbol);
  }
);

export const getIsPreviousOfferAvailable = createSelector(
  getCurrentOfferIndex,
  (currentOfferIndex: number) => {
    return currentOfferIndex > 0;
  }
);

export const getIsNextOfferAvailable = createSelector(
  getCurrentOfferIndex,
  getCurrentSearchOffersQuantity,
  (currentOfferIndex: number, currentSearchOffersQuantity: number) => {
    return (
      currentOfferIndex !== -1 &&
      currentOfferIndex < currentSearchOffersQuantity - 1
    );
  }
);

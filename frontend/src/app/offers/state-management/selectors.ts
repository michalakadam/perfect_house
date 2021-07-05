import { createFeatureSelector, createSelector } from "@ngrx/store";
import { OFFERS_PER_PAGE } from "src/app/shared/constants";
import { AVAILABLE_SORTINGS, Offer } from "src/app/shared/models";
import { featureName as offersFeatureName, OffersState } from "./reducers";
import { sortOffers } from "./sorting-helper-functions";
import {
  computeDistinctLocations,
  computeEstateTypesWithSubtypes,
  computeOffersForCurrentPage,
  computeVoivodeshipsWithCounties,
} from "./state-helper-functions";

const selectOffersState = createFeatureSelector<OffersState>(offersFeatureName);

export const getIsLoading = createSelector(
  selectOffersState,
  (state: OffersState) => state.isLoading
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

export const getCurrentPageNumber = createSelector(
  selectOffersState,
  (state: OffersState) => state.currentPage
);

export const getOffersForCurrentPage = createSelector(
  getCurrentSearchOffers,
  getCurrentPageNumber,
  (currentSearchOffers: Offer[], currentPage: number) => {
    return computeOffersForCurrentPage(currentSearchOffers, currentPage);
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
    const offersOverPageSize = currentSearchOffers.length / OFFERS_PER_PAGE;

    return currentSearchOffers.length % OFFERS_PER_PAGE === 0
      ? offersOverPageSize - 1
      : Math.trunc(offersOverPageSize);
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
  getCurrentSearchOffers,
  (currentSearchOffers: Offer[]) => {
    return computeVoivodeshipsWithCounties(currentSearchOffers);
  }
);

export const getEstateTypesWithSubtypes = createSelector(
  getCurrentSearchOffers,
  (currentSearchOffers: Offer[]) => {
    return computeEstateTypesWithSubtypes(currentSearchOffers);
  }
);

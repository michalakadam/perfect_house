import { createFeatureSelector, createSelector } from "@ngrx/store";
import { featureName as offersFeatureName, OffersState } from "./reducers";

const selectOffersState = createFeatureSelector<OffersState>(offersFeatureName);

export const getIsLoading = createSelector(
  selectOffersState,
  (state: OffersState) => state.isLoading
);

export const getOffers = createSelector(
  selectOffersState,
  (state: OffersState) => state.offers
);

export const getOffersForMainPage = createSelector(
  selectOffersState,
  (state: OffersState) => state.mainPageOffers
);

import { createAction, props } from "@ngrx/store";
import { Offer, OffersFilters, Sorting } from "src/app/shared/models";

// Actions' identifiers.
export const LIST_OFFERS = "[Offers] List";
export const LIST_OFFERS_SUCCESS = "[Offers] List Success";
export const LIST_OFFERS_ERROR = "[Offers] List Error";
export const SEARCH_OFFERS = "[Offers] Search";

// Actions' definitions.
export const listOffers = createAction(LIST_OFFERS);
export const listOffersSuccess = createAction(
  LIST_OFFERS_SUCCESS,
  props<{ offers: Offer[] }>()
);
export const listOffersError = createAction(LIST_OFFERS_ERROR);
export const searchOffers = createAction(
  SEARCH_OFFERS,
  props<{ page: number; sorting: Sorting; filters: OffersFilters }>()
);

import { Params } from "@angular/router";
import { createAction, props } from "@ngrx/store";
import { Offer, OffersFilters, Sorting } from "src/app/shared/models";

// Actions' identifiers.
export const LIST_OFFERS = "[Offers] List";
export const LIST_OFFERS_SUCCESS = "[Offers] List Success";
export const LIST_OFFERS_ERROR = "[Offers] List Error";
export const NAVIGATE_TO_OFFERS_PAGE = "[Offers] Load page with offers";
export const UPDATE_SEARCH_PARAMS = "[Offers] Update search params";
export const UPDATE_PAGE_NUMBER = "[Offers] Update page number";
export const UPDATE_SORTING = "[Offers] Update sorting";
export const UPDATE_FILTERS = "[Offers] Update filters";
export const SEARCH_PARAMS_IDENTICAL = "[Offers] Search params did not change";

// Actions' definitions.
export const listOffers = createAction(LIST_OFFERS);
export const listOffersSuccess = createAction(
  LIST_OFFERS_SUCCESS,
  props<{ offers: Offer[] }>()
);
export const listOffersError = createAction(LIST_OFFERS_ERROR);
export const navigateToOffersPage = createAction(
  NAVIGATE_TO_OFFERS_PAGE,
  props<{ queryParams: Params }>()
);
export const updateSearchParams = createAction(
  UPDATE_SEARCH_PARAMS,
  props<{ queryParams: Params }>()
);
export const updatePageNumber = createAction(
  UPDATE_PAGE_NUMBER,
  props<{ pageNumber: number }>()
);

export const updateSorting = createAction(
  UPDATE_SORTING,
  props<{ sorting: Sorting }>()
);

export const updateFilters = createAction(
  UPDATE_FILTERS,
  props<{ filters: OffersFilters }>()
);
export const searchParamsIdentical = createAction(SEARCH_PARAMS_IDENTICAL);

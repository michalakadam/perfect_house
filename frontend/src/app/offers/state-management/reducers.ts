import { Action, createReducer, on } from "@ngrx/store";
import {
  listOffersSuccess,
  listOffersError,
  listOffers,
  updateSearchParams,
  navigateToOffersPage,
} from "./actions";
import {
  DEFAULT_FILTERS,
  DEFAULT_SORTING,
  Offer,
  OffersFilters,
  Sorting,
} from "src/app/shared/models";
import {
  computeCurrentSearchOffers,
  computeMainPageOffers,
  computeNumberOfPages,
  extractFiltersFromParams,
  extractPageNumberFromParams,
  extractSortingFromParams,
} from "./state-helper-functions";

export const stateKey = "offers";

export interface OffersState {
  isLoading: boolean;
  isSearching: boolean;
  allOffers: Offer[];
  mainPageOffers: Offer[];
  currentSearchOffers: Offer[];
  pageNumber: number;
  sorting: Sorting;
  filters: OffersFilters;
}

const initialState: OffersState = {
  isLoading: true,
  isSearching: true,
  allOffers: [],
  mainPageOffers: [],
  currentSearchOffers: [],
  pageNumber: 0,
  sorting: DEFAULT_SORTING,
  filters: DEFAULT_FILTERS,
};

const offersReducer = createReducer(
  initialState,
  on(listOffers, (state) => ({
    ...state,
    ...initialState,
  })),
  on(listOffersSuccess, (state, { offers }) => ({
    ...state,
    isLoading: false,
    allOffers: offers,
    mainPageOffers: computeMainPageOffers(offers),
    currentSearchOffers: computeCurrentSearchOffers(
      state.sorting,
      state.filters,
      offers
    ),
  })),
  on(listOffersError, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(updateSearchParams, (state, { queryParams }) => {
    const pageNumber = extractPageNumberFromParams(queryParams);
    const sorting = extractSortingFromParams(queryParams);
    const filters = extractFiltersFromParams(queryParams);
    const currentSearchOffers = computeCurrentSearchOffers(
      sorting,
      filters,
      state.allOffers
    );
    return {
      ...state,
      isSearching: false,
      currentSearchOffers,
      pageNumber:
        pageNumber > computeNumberOfPages(currentSearchOffers) ? 0 : pageNumber,
      sorting,
      filters,
    };
  }),
  on(navigateToOffersPage, (state) => ({
    ...state,
    isSearching: true,
  }))
);

export function reducer(state: OffersState | undefined, action: Action) {
  return offersReducer(state, action);
}

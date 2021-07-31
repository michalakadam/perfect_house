import { Action, createReducer, on } from "@ngrx/store";
import {
  listOffersSuccess,
  listOffersError,
  listOffers,
  updateSearchParams,
  loadCurrentOffer,
} from "./actions";
import {
  DEFAULT_FILTERS,
  DEFAULT_SORTING,
  Offer,
  OffersFilters,
  Sorting,
} from "src/app/shared/models";
import {
  computeAgentOffers,
  computeCurrentSearchOffers,
  computeMainPageOffers,
  computeNumberOfPages,
  extractFiltersFromParams,
  extractPageNumberFromParams,
  extractSortingFromParams,
} from "./state-helper-functions";
import { loadCurrentAgent } from "src/app/agents/state-management/actions";
import {
  openOfferPage,
  openOffersPage,
} from "src/app/router/state-management/actions";

export const stateKey = "offers";

export interface OffersState {
  isLoading: boolean;
  isSearching: boolean;
  allOffers: Offer[];
  mainPageOffers: Offer[];
  currentSearchOffers: Offer[];
  currentOffer: Offer;
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
  currentOffer: null,
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
  on(openOffersPage, (state) => ({
    ...state,
    isSearching: true,
  })),
  on(loadCurrentAgent, (state, { agent }) => ({
    ...state,
    isSearching: false,
    currentSearchOffers: computeAgentOffers(
      state.allOffers,
      parseInt(agent.id)
    ),
    pageNumber: 0,
    sorting: DEFAULT_SORTING,
    filters: DEFAULT_FILTERS,
  })),
  on(openOfferPage, (state) => ({
    ...state,
    currentOffer: null,
  })),
  on(loadCurrentOffer, (state, { offer }) => ({
    ...state,
    currentOffer: offer,
  }))
);

export function reducer(state: OffersState | undefined, action: Action) {
  return offersReducer(state, action);
}

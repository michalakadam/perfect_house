import { Action, createReducer, on } from "@ngrx/store";
import {
  listOffersSuccess,
  listOffersError,
  listOffers,
  searchOffers,
} from "./actions";
import { DEFAULT_FILTERS, DEFAULT_SORTING, Offer } from "src/app/shared/models";
import {
  computeCurrentSearchOffers,
  computeMainPageOffers,
} from "./state-helper-functions";

export const featureName = "offers";

export interface OffersState {
  isLoading: boolean;
  allOffers: Offer[];
  mainPageOffers: Offer[];
  currentSearchOffers: Offer[];
  currentPage: number;
}

const initialState: OffersState = {
  isLoading: true,
  allOffers: [],
  mainPageOffers: [],
  currentSearchOffers: [],
  currentPage: 0,
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
      DEFAULT_SORTING,
      DEFAULT_FILTERS,
      offers
    ),
  })),
  on(listOffersError, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(searchOffers, (state, { page, sorting, filters }) => ({
    ...state,
    currentSearchOffers: computeCurrentSearchOffers(
      sorting,
      filters,
      state.allOffers
    ),
    currentPage: page,
  }))
);

export function reducer(state: OffersState | undefined, action: Action) {
  return offersReducer(state, action);
}

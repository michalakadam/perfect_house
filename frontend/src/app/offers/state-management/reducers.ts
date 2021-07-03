import { Action, createReducer, on } from "@ngrx/store";
import {
  listOffersSuccess,
  listOffersError,
  listOffers,
  searchOffers,
} from "./actions";
import { Offer } from "src/app/shared/models";
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
}

const initialState: OffersState = {
  isLoading: true,
  allOffers: [],
  mainPageOffers: [],
  currentSearchOffers: [],
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
    currentSearchOffers: offers,
  })),
  on(listOffersError, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(searchOffers, (state, { page, sorting, filters }) => ({
    ...state,
    currentSearchOffers: computeCurrentSearchOffers(
      page,
      sorting,
      filters,
      state.allOffers
    ),
  }))
);

export function reducer(state: OffersState | undefined, action: Action) {
  return offersReducer(state, action);
}

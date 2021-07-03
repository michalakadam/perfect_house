import { Action, createReducer, on } from "@ngrx/store";
import { listOffersSuccess, listOffersError, listOffers } from "./actions";
import { Offer } from "src/app/shared/models";
import { computeMainPageOffers } from "./helper-functions";

export const featureName = "offers";

export interface OffersState {
  isLoading: boolean;
  offers: Offer[];
  mainPageOffers: Offer[];
}

const initialState: OffersState = {
  isLoading: true,
  offers: [],
  mainPageOffers: [],
};

const offersReducer = createReducer(
  initialState,
  on(listOffers, (state) => ({
    ...state,
    isLoading: true,
    offers: [],
    mainPageOffers: [],
  })),
  on(listOffersSuccess, (state, { offers }) => ({
    ...state,
    isLoading: false,
    offers,
    mainPageOffers: computeMainPageOffers(offers),
  })),
  on(listOffersError, (state) => ({
    ...state,
    isLoading: false,
  }))
);

export function reducer(state: OffersState | undefined, action: Action) {
  return offersReducer(state, action);
}

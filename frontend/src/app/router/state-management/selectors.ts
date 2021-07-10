import { RouterReducerState } from "@ngrx/router-store";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PerfectRoute } from "./route";
import { stateKey } from "./state-management.module";

const getRouterReducerState =
  createFeatureSelector<RouterReducerState<PerfectRoute>>(stateKey);

export const getUrl = createSelector(
  getRouterReducerState,
  (routerReducerState) => routerReducerState.state.url
);

export const getParams = createSelector(
  getRouterReducerState,
  (routerReducerState) => routerReducerState.state.params
);

export const getQueryParams = createSelector(
  getRouterReducerState,
  (routerReducerState) => routerReducerState.state.queryParams
);

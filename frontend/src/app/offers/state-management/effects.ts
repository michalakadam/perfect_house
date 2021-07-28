import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of as observableOf } from "rxjs";
import { map, mergeMap, catchError, withLatestFrom, tap } from "rxjs/operators";
import { OffersApiCaller } from "./offers-api-caller.service";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { HttpErrorResponse } from "@angular/common/http";
import {
  listOffersSuccess,
  listOffersError,
  LIST_OFFERS,
  navigateToOffersPage,
  updateSearchParams,
  UPDATE_PAGE_NUMBER,
  UPDATE_SORTING,
  UPDATE_FILTERS,
  searchParamsIdentical,
} from "./actions";
import { OFFERS_PAGE_NAVIGATED } from "src/app/router/state-management/actions";
import { Action, Store } from "@ngrx/store";
import * as routerSelectors from "src/app/router/state-management/selectors";
import * as offersSelectors from "./selectors";
import { Params } from "@angular/router";
import { DEFAULT_SORTING, OffersFilters, Sorting } from "src/app/shared/models";
import {
  convertToFiltersParameters,
  convertToSortingParameter,
} from "./state-helper-functions";

const LIST_OFFERS_ERROR_MESSAGE =
  "Wystąpił niespodziewany błąd w trakcie ładowania ofert.";

const FIRST_PAGE_NUMBER = 1;

const computeSortingParameter = (sorting: Sorting): string => {
  return (
    sorting.propertyName +
    "_" +
    (sorting.isAscending ? "ascending" : "descending")
  );
};

export const DEFAULT_QUERY_PARAMETERS = {
  page: FIRST_PAGE_NUMBER,
  sorting: computeSortingParameter(DEFAULT_SORTING),
};

@Injectable()
export class OffersEffects {
  constructor(
    private actions$: Actions,
    private offersApiCaller: OffersApiCaller,
    private snackbarService: SnackbarService,
    private store: Store
  ) {}

  loadOffers = createEffect(() =>
    this.actions$.pipe(
      ofType(LIST_OFFERS),
      mergeMap(() =>
        this.offersApiCaller.loadOffers().pipe(
          map((offers) => listOffersSuccess({ offers })),
          catchError((error: HttpErrorResponse) => {
            this.handleError(error);
            return observableOf(listOffersError());
          })
        )
      )
    )
  );

  private handleError(error: HttpErrorResponse) {
    this.snackbarService.open(LIST_OFFERS_ERROR_MESSAGE);
    if (error.status === 0) {
      // A client-side or network error occurred.
      console.error(`An error occurred: ${JSON.stringify(error.error)}`);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
  }

  loadOffersForUpdatedPageNumber = createEffect(() =>
    this.actions$.pipe(
      ofType(UPDATE_PAGE_NUMBER),
      withLatestFrom(
        this.store.select(offersSelectors.getPageNumber),
        this.store.select(offersSelectors.getSorting),
        this.store.select(offersSelectors.getFilters),
        (
          { pageNumber: updatedPageNumber },
          currentPageNumber,
          sorting,
          filters
        ) => ({
          updatedPageNumber,
          currentPageNumber,
          sorting,
          filters,
        })
      ),
      map(({ updatedPageNumber, currentPageNumber, sorting, filters }) => {
        if (updatedPageNumber === currentPageNumber) {
          return searchParamsIdentical();
        }
        return this.navigate(updatedPageNumber, sorting, filters);
      })
    )
  );

  loadOffersForUpdatedSorting = createEffect(() =>
    this.actions$.pipe(
      ofType(UPDATE_SORTING),
      withLatestFrom(
        this.store.select(offersSelectors.getPageNumber),
        this.store.select(offersSelectors.getSorting),
        this.store.select(offersSelectors.getFilters),
        ({ sorting: updatedSorting }, pageNumber, currentSorting, filters) => ({
          updatedSorting,
          pageNumber,
          currentSorting,
          filters,
        })
      ),
      map(({ updatedSorting, pageNumber, currentSorting, filters }) => {
        if (JSON.stringify(updatedSorting) === JSON.stringify(currentSorting)) {
          return searchParamsIdentical();
        }
        return this.navigate(pageNumber, updatedSorting, filters);
      })
    )
  );

  loadOffersForUpdatedFilters = createEffect(() =>
    this.actions$.pipe(
      ofType(UPDATE_FILTERS),
      withLatestFrom(
        this.store.select(offersSelectors.getPageNumber),
        this.store.select(offersSelectors.getSorting),
        this.store.select(offersSelectors.getFilters),
        ({ filters: updatedFilters }, pageNumber, sorting, currentFilters) => ({
          updatedFilters,
          pageNumber,
          sorting,
          currentFilters,
        })
      ),
      map(({ updatedFilters, pageNumber, sorting, currentFilters }) => {
        if (JSON.stringify(updatedFilters) === JSON.stringify(currentFilters)) {
          return searchParamsIdentical();
        }
        return this.navigate(pageNumber, sorting, updatedFilters);
      })
    )
  );

  private navigate(
    pageNumber: number,
    sorting: Sorting,
    filters: OffersFilters
  ): Action {
    const queryParams = {
      page: pageNumber + 1,
      sorting: convertToSortingParameter(sorting),
      ...convertToFiltersParameters(filters),
    };
    return navigateToOffersPage({ queryParams });
  }

  searchOffersBasedOnRouterParams = createEffect(() =>
    this.actions$.pipe(
      ofType(OFFERS_PAGE_NAVIGATED),
      withLatestFrom(this.store.select(routerSelectors.getQueryParams)),
      map(([action, queryParams]: [Action, Params]) => {
        const paramsMissing =
          !queryParams.hasOwnProperty("page") ||
          !queryParams.hasOwnProperty("sorting");
        if (paramsMissing) {
          return navigateToOffersPage({
            queryParams: { ...DEFAULT_QUERY_PARAMETERS, ...queryParams },
          });
        }
        return updateSearchParams({ queryParams });
      })
    )
  );
}

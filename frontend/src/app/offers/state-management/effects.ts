import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of as observableOf } from "rxjs";
import { map, mergeMap, catchError } from "rxjs/operators";
import { OffersApiCaller } from "./offers-api-caller.service";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { HttpErrorResponse } from "@angular/common/http";
import { listOffersSuccess, listOffersError, LIST_OFFERS } from "./actions";

const LIST_OFFERS_ERROR_MESSAGE =
  "Wystąpił niespodziewany błąd w trakcie ładowania ofert.";

@Injectable()
export class OffersEffects {
  constructor(
    private actions$: Actions,
    private offersApiCaller: OffersApiCaller,
    private snackbarService: SnackbarService
  ) {}

  loadOffers$ = createEffect(() =>
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
      console.error(`An error occurred: ${error.error}`);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
  }
}

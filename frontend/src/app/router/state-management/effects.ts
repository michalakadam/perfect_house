import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, filter, tap } from "rxjs/operators";
import { RouterNavigatedAction, ROUTER_NAVIGATED } from "@ngrx/router-store";
import { offersPageNavigated } from "./actions";
import { Router } from "@angular/router";
import { NAVIGATE_TO_OFFERS_PAGE } from "src/app/offers/state-management/actions";
import { Action } from "@ngrx/store";

const OFFERS_PAGE_PREFIX = "/oferty";

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions, private router: Router) {}

  isOffersPageNavigated = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter((action: RouterNavigatedAction) =>
        action.payload.routerState.url.startsWith(OFFERS_PAGE_PREFIX)
      ),
      map((action: RouterNavigatedAction) => offersPageNavigated())
    )
  );

  navigateToOffersPage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NAVIGATE_TO_OFFERS_PAGE),
        tap(({ queryParams }) => {
          this.router.navigate(["oferty"], { queryParams });
        })
      ),
    { dispatch: false }
  );
}

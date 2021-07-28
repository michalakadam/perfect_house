import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, filter, tap } from "rxjs/operators";
import { RouterNavigatedAction, ROUTER_NAVIGATED } from "@ngrx/router-store";
import { offersPageNavigated, PAGE_NOT_FOUND } from "./actions";
import { Router } from "@angular/router";
import { NAVIGATE_TO_OFFERS_PAGE } from "src/app/offers/state-management/actions";
import { agentPageNavigated } from "./actions";

const OFFERS_PAGE_PREFIX = "/oferty";
const AGENTS_PAGE_PREFIX = "/ludzie";

@Injectable()
export class RouterEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly router: Router
  ) {}

  navigateToPageNotFound = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PAGE_NOT_FOUND),
        tap(() => {
          this.router.navigate(["/strona-nie-istnieje"]);
        })
      ),
    { dispatch: false }
  );

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

  isAgentPageNavigated = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter((action: RouterNavigatedAction) => {
        const url = action.payload.routerState.url;
        return url.startsWith(AGENTS_PAGE_PREFIX) && url !== AGENTS_PAGE_PREFIX;
      }),
      map(() => {
        return agentPageNavigated();
      })
    )
  );
}

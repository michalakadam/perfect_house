import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, filter, tap } from 'rxjs/operators';
import { RouterNavigatedAction, ROUTER_NAVIGATED } from '@ngrx/router-store';
import {
  agentPageNavigated,
  offerPageNavigated,
  offersPageNavigated,
  OPEN_AGENT_PAGE,
  OPEN_OFFERS_PAGE,
  OPEN_OFFER_PAGE,
  PAGE_NOT_FOUND,
} from './actions';
import { Router } from '@angular/router';

const OFFER_PAGE_PREFIX = '/oferta';
const OFFERS_PAGE_PREFIX = '/oferty';
const AGENTS_PAGE_PREFIX = '/ludzie';

@Injectable()
export class RouterEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
  ) {}

  navigateToPageNotFound = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PAGE_NOT_FOUND),
        tap(() => {
          this.router.navigate(['/strona-nie-istnieje']);
        }),
      ),
    { dispatch: false },
  );

  isOffersPageNavigated = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter((action: RouterNavigatedAction) =>
        action.payload.routerState.url.startsWith(OFFERS_PAGE_PREFIX),
      ),
      map((action: RouterNavigatedAction) => offersPageNavigated()),
    ),
  );

  navigateToOffersPage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OPEN_OFFERS_PAGE),
        tap(({ queryParams }) => {
          this.router.navigate(['oferty'], { queryParams });
        }),
      ),
    { dispatch: false },
  );

  isOfferPageNavigated = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter((action: RouterNavigatedAction) =>
        isPage(action.payload.routerState.url, OFFER_PAGE_PREFIX),
      ),
      map(() => {
        return offerPageNavigated();
      }),
    ),
  );

  redirectToOfferPage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OPEN_OFFER_PAGE),
        tap(({ offerSymbol }) => {
          this.router.navigate(['/oferta/', offerSymbol]);
        }),
      ),
    { dispatch: false },
  );

  isAgentPageNavigated = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      filter((action: RouterNavigatedAction) =>
        isPage(action.payload.routerState.url, AGENTS_PAGE_PREFIX),
      ),
      map(() => {
        return agentPageNavigated();
      }),
    ),
  );

  redirectToAgentPage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OPEN_AGENT_PAGE),
        tap(({ agentFullName }) => {
          this.router.navigate([
            '/ludzie/',
            convertAgentNameToUrlSuffix(agentFullName),
          ]);
        }),
      ),
    { dispatch: false },
  );
}

const isPage = (url, urlPrefix: string) => {
  return url.startsWith(urlPrefix) && url !== urlPrefix;
};

const convertAgentNameToUrlSuffix = (fullName: string) => {
  return fullName.toLowerCase().split(' ').join('-');
};

import { Params } from "@angular/router";
import { createAction, props } from "@ngrx/store";

// Actions' identifiers.
export const PAGE_NOT_FOUND = "[Router] Page not found";
export const OFFERS_PAGE_NAVIGATED = "[Router] Offers page navigated";
export const OPEN_OFFERS_PAGE = "[Router] Opening offers' page";
export const OFFER_PAGE_NAVIGATED = "[Router] Offer's page navigated";
export const OPEN_OFFER_PAGE = "[Router] Opening offer's page";
export const AGENT_PAGE_NAVIGATED = "[Router] Agents page navigated";
export const OPEN_AGENT_PAGE = "[Router] Opening agent page";

// Actions' definitions.
export const pageNotFound = createAction(PAGE_NOT_FOUND);
export const offersPageNavigated = createAction(OFFERS_PAGE_NAVIGATED);
export const openOffersPage = createAction(
  OPEN_OFFERS_PAGE,
  props<{ queryParams: Params }>()
);
export const offerPageNavigated = createAction(OFFER_PAGE_NAVIGATED);
export const openOfferPage = createAction(
  OPEN_OFFER_PAGE,
  props<{ offerSymbol: string }>()
);
export const agentPageNavigated = createAction(AGENT_PAGE_NAVIGATED);
export const openAgentPage = createAction(
  OPEN_AGENT_PAGE,
  props<{ agentFullName: string }>()
);

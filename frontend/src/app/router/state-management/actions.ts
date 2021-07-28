import { createAction, props } from "@ngrx/store";

// Actions' identifiers.
export const PAGE_NOT_FOUND = "[Router] Page not found";
export const OFFERS_PAGE_NAVIGATED = "[Router] Offers page navigated";
export const AGENT_PAGE_NAVIGATED = "[Agents] Agents page navigated";

// Actions' definitions.
export const pageNotFound = createAction(PAGE_NOT_FOUND);
export const offersPageNavigated = createAction(OFFERS_PAGE_NAVIGATED);
export const agentPageNavigated = createAction(AGENT_PAGE_NAVIGATED);

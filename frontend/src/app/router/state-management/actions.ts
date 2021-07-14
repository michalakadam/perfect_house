import { createAction } from "@ngrx/store";

// Actions' identifiers.
export const OFFERS_PAGE_NAVIGATED = "[Router] Offers page navigated";

// Actions' definitions.
export const offersPageNavigated = createAction(OFFERS_PAGE_NAVIGATED);

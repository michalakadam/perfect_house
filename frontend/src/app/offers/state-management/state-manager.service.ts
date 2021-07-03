import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { listOffers } from "./actions";
import * as selectors from "./selectors";

@Injectable({
  providedIn: "root",
})
export class OffersStateManager {
  constructor(private store: Store) {
    this.store.dispatch(listOffers());
  }

  offers$ = this.store.select(selectors.getOffers);

  isLoading$ = this.store.select(selectors.getIsLoading);

  offersForMainPage$ = this.store.select(selectors.getOffersForMainPage);
}

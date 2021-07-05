import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Offer, OffersFilters, Sorting } from "src/app/shared/models";
import { Observable } from "rxjs";
import { listOffers, searchOffers } from "./actions";
import * as selectors from "./selectors";

@Injectable({
  providedIn: "root",
})
export class OffersStateManager {
  constructor(private store: Store) {
    this.store.dispatch(listOffers());
  }

  isLoading$: Observable<boolean> = this.store.select(selectors.getIsLoading);

  offersForMainPage$: Observable<Offer[]> = this.store.select(
    selectors.getOffersForMainPage
  );

  offersForCurrentPage$: Observable<Offer[]> = this.store.select(
    selectors.getOffersForCurrentPage
  );

  currentSearchOffersQuantity$: Observable<number> = this.store.select(
    selectors.getCurrentSearchOffersQuantity
  );

  lowestPriceForCurrentSearch$: Observable<number> = this.store.select(
    selectors.getLowestPriceForCurrentSearch
  );

  highestPriceForCurrentSearch$: Observable<number> = this.store.select(
    selectors.getHighestPriceForCurrentSearch
  );

  numberOfPages$: Observable<number> = this.store.select(
    selectors.getNumberOfPages
  );

  voivodeshipsWithCounties$: Observable<Map<string, string[]>> =
    this.store.select(selectors.getVoivodeshipsWithCounties);

  estateTypesWithSubtypes$: Observable<Map<string, string[]>> =
    this.store.select(selectors.getEstateTypesWithSubtypes);

  distinctLocations$(
    voivodeship: string,
    county: string
  ): Observable<string[]> {
    return this.store.select(
      selectors.getDistinctLocations(voivodeship, county)
    );
  }

  offerBySymbol$(symbol: string): Observable<Offer> {
    return this.store.select(selectors.getOfferBySymbol(symbol));
  }

  offerByNumber$(number: number): Observable<Offer> {
    return this.store.select(selectors.getOfferByNumber(number));
  }

  search(page: number, sorting: Sorting, filters: OffersFilters) {
    this.store.dispatch(searchOffers({ page, sorting, filters }));
  }
}

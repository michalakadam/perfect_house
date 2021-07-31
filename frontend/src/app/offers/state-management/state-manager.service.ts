import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Offer, OffersFilters, Sorting } from "src/app/shared/models";
import { Observable } from "rxjs";
import {
  listOffers,
  loadNextOffer,
  loadPreviousOffer,
  openMainPageOffer,
  updateFilters,
  updatePageNumber,
  updateSorting,
} from "./actions";
import * as selectors from "./selectors";

@Injectable({
  providedIn: "root",
})
export class OffersStateManager {
  constructor(private store: Store) {
    this.store.dispatch(listOffers());
  }

  isLoading$: Observable<boolean> = this.store.select(selectors.getIsLoading);

  isSearching$: Observable<boolean> = this.store.select(
    selectors.getIsSearching
  );

  currentOffer$: Observable<Offer> = this.store.select(
    selectors.getCurrentOffer
  );

  isPreviousOfferAvailable$: Observable<boolean> = this.store.select(
    selectors.getIsPreviousOfferAvailable
  );

  isNextOfferAvailable$: Observable<boolean> = this.store.select(
    selectors.getIsNextOfferAvailable
  );

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

  pageNumber$: Observable<number> = this.store.select(selectors.getPageNumber);

  sorting$: Observable<Sorting> = this.store.select(selectors.getSorting);

  filters$: Observable<OffersFilters> = this.store.select(selectors.getFilters);

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

  offersCountByAgentId$(agentId: string): Observable<number> {
    return this.store.select(
      selectors.getOffersCountByAgentId(parseInt(agentId))
    );
  }

  updatePageNumber(pageNumber: number) {
    this.store.dispatch(updatePageNumber({ pageNumber }));
  }

  updateSorting(sorting: Sorting) {
    this.store.dispatch(updateSorting({ sorting }));
  }

  updateFilters(filters: OffersFilters) {
    this.store.dispatch(updateFilters({ filters }));
  }

  openMainPageOffer(offerSymbol: string) {
    this.store.dispatch(openMainPageOffer({ offerSymbol }));
  }

  loadPreviousOffer() {
    this.store.dispatch(loadPreviousOffer());
  }

  loadNextOffer() {
    this.store.dispatch(loadNextOffer());
  }
}

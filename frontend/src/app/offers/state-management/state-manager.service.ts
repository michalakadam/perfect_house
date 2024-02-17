import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Offer, OffersFilters, Sorting } from 'src/app/shared/models';
import { Observable } from 'rxjs';
import {
  listOffers,
  loadNextOffer,
  loadPreviousOffer,
  openMainPageOffer,
  updateFilters,
  updatePageNumber,
  updateSorting,
} from './actions';
import * as selectors from './selectors';

@Injectable({
  providedIn: 'root',
})
export class OffersStateManager {
  constructor(private store: Store) {
    this.store.dispatch(listOffers());
  }

  get isLoading$(): Observable<boolean> {
    return this.store.select(selectors.getIsLoading);
  }

  get isCurrentOfferLoading$(): Observable<boolean> {
    return this.store.select(selectors.getIsCurrentOfferLoading);
  }

  get currentOffer$(): Observable<Offer> {
    return this.store.select(selectors.getCurrentOffer);
  }

  get isPreviousOfferAvailable$(): Observable<boolean> {
    return this.store.select(selectors.getIsPreviousOfferAvailable);
  }

  get isNextOfferAvailable$(): Observable<boolean> {
    return this.store.select(selectors.getIsNextOfferAvailable);
  }

  get offersForMainPage$(): Observable<Offer[]> {
    return this.store.select(selectors.getOffersForMainPage);
  }

  get offersForCurrentPage$(): Observable<Offer[]> {
    return this.store.select(selectors.getOffersForCurrentPage);
  }

  get currentSearchOffersQuantity$(): Observable<number> {
    return this.store.select(selectors.getCurrentSearchOffersQuantity);
  }

  get lowestPriceForCurrentSearch$(): Observable<number> {
    return this.store.select(selectors.getLowestPriceForCurrentSearch);
  }

  get highestPriceForCurrentSearch$(): Observable<number> {
    return this.store.select(selectors.getHighestPriceForCurrentSearch);
  }

  get pageNumber$(): Observable<number> {
    return this.store.select(selectors.getPageNumber);
  }

  get sorting$(): Observable<Sorting> {
    return this.store.select(selectors.getSorting);
  }

  get filters$(): Observable<OffersFilters> {
    return this.store.select(selectors.getFilters);
  }

  get numberOfPages$(): Observable<number> {
    return this.store.select(selectors.getNumberOfPages);
  }

  get voivodeshipsWithCounties$(): Observable<Map<string, string[]>> {
    return this.store.select(selectors.getVoivodeshipsWithCounties);
  }

  get estateTypesWithSubtypes$(): Observable<Map<string, string[]>> {
    return this.store.select(selectors.getEstateTypesWithSubtypes);
  }

  distinctLocations$(
    voivodeship: string,
    county: string,
  ): Observable<string[]> {
    return this.store.select(
      selectors.getDistinctLocations(voivodeship, county),
    );
  }

  offersCountByAgentId$(agentId: string): Observable<number> {
    return this.store.select(
      selectors.getOffersCountByAgentId(parseInt(agentId)),
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

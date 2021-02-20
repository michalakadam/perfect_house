import { Injectable } from '@angular/core';

import * as rawOffers from "src/offers/offers.json";
import { OffersFilters, Offer, Sorting, AVAILABLE_SORTINGS } from '../models';
import { OffersConverter } from './offers-converter.service';
import { OffersFilter } from './offers-filter.service';
import { OffersSorter } from './offers-sorter.service';

const OFFERS_PER_PAGE = 50;

@Injectable({
    providedIn: 'root',
})
export class OffersDao {
    private allOffers: Offer[];
    private currentSearchOffers: Offer[];
    private currentSearchOffersSortedByPriceAsc: Offer[];
    private offersForCarousel: Offer[];

    constructor(private offersConverter: OffersConverter,
        private offersSorter: OffersSorter,
        private offersFilter: OffersFilter) {
            this.allOffers = this.offersConverter
                .convertToReadableOffers(rawOffers.Oferty.Oferta);
    }

    initializeOffersForTheMainPage() {
        this.currentSearchOffers = this.allOffers;
        this.currentSearchOffersSortedByPriceAsc = this.sortCurrentOffersByPrice();
        this.offersForCarousel = this.computeOffersForCarousel();
    }

    list(page: number, sorting: Sorting, filters: OffersFilters): Offer[] {
        const filteredOffers = this.offersFilter.filterOffers(this.allOffers, filters);

        this.currentSearchOffers = this.offersSorter.sortOffers(filteredOffers, sorting);
        this.currentSearchOffersSortedByPriceAsc = this.sortCurrentOffersByPrice();
        // Filtering by price needs to be done at the end in order to retrieve price slider
        // min/max value properly.
        this.currentSearchOffers = this.offersFilter
            .filterOffersByPrice(this.currentSearchOffers, filters);

        const startIndex = page * OFFERS_PER_PAGE; 
        return this.currentSearchOffers.slice(startIndex, startIndex + OFFERS_PER_PAGE);
    }

    private sortCurrentOffersByPrice(): Offer[] {
        return this.offersSorter
            .sortOffers(
                [...this.currentSearchOffers],
                AVAILABLE_SORTINGS.find(sorting => sorting.displayName === 'cenie rosnąco')
            );

    }

    computeOffersForCarousel(): Offer[] {
        return this.allOffers
            .filter(offer => offer.isExclusive)
            .sort((a, b) => a.creationDate < b.creationDate ? -1 :
                (a.creationDate > b.creationDate ? 1 : 0));
    }

    getOffersForCarousel(): Offer[] {
        return this.offersForCarousel;
    }

    getOffersQuantity(): number {
        return this.currentSearchOffers ? this.currentSearchOffers.length : 0;
    }

    getOffersPerPage(): number {
        return OFFERS_PER_PAGE;
    }

    getNumberOfPages(): number {
        if (!this.currentSearchOffers) {
            return 0;
        }
        const offersOverPageSize = this.currentSearchOffers.length / OFFERS_PER_PAGE; 
        if (this.currentSearchOffers.length % OFFERS_PER_PAGE === 0) {
            return offersOverPageSize - 1;
        }
        return Math.trunc(offersOverPageSize);
    }

    getOfferBySymbol(symbol: string): Offer {
        return this.allOffers.find(offer => offer.symbol === symbol);
    }

    getOfferByNumber(number: number): Offer {
        return this.allOffers.find(offer => offer.number === number);
    }
    
    getLowestPriceForCurrentSearch(): number {
        return this.getOffersQuantity() ?
            this.currentSearchOffersSortedByPriceAsc[0].price : 0;
    }

    getHighestPriceForCurrentSearch(): number {
        return this.getOffersQuantity() ?
            this.currentSearchOffersSortedByPriceAsc[
                this.currentSearchOffersSortedByPriceAsc.length - 1]
            .price : 0;
    }

    getDistinctLocations(): string[] {
        return this.allOffers
            .map(offer => offer.fullLocation)
            .filter(this.onlyUnique)
            .sort(this.sortAlphabetically);
    }

    getAvailableVoivodeships(): string[] {
        const distinctVoivodeships = this.allOffers
            .map(offer => offer.voivodeship)
            .filter(this.onlyUnique)
            .sort(this.sortAlphabetically);

        return ['cała Polska', ...distinctVoivodeships];
    }

    private onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    sortAlphabetically(a: string, b: string): number {
        return a.localeCompare(b, 'pl');
    }
}

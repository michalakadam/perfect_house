import { Injectable } from '@angular/core';

import * as rawOffers from "src/offers/offers.json";
import { OffersFilters, Offer, Sorting } from '../shared/models';
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

    constructor(private offersConverter: OffersConverter,
        private offersSorter: OffersSorter,
        private offersFilter: OffersFilter) {
        this.allOffers = this.offersConverter.convertToReadableOffers(rawOffers.Oferty.Oferta);
    }

    list(page: number, sorting: Sorting, filters: OffersFilters): Offer[] {
        const filteredOffers = this.offersFilter.filterOffers(this.allOffers, filters);

        this.currentSearchOffers = this.offersSorter.sortOffers(filteredOffers, sorting);
        const startIndex = page * OFFERS_PER_PAGE; 
        return this.currentSearchOffers.slice(startIndex, startIndex + OFFERS_PER_PAGE);
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
}

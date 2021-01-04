import { Injectable } from '@angular/core';

import * as rawOffers from "src/offers/offers.json";
import { Offer } from '../shared/models/offer';
import { Sorting, SortingType } from '../shared/models/sorting';
import { OffersConverter } from './offers-converter.service';
import { OffersSorter } from './offers-sorter.service';

const OFFERS_PER_PAGE = 50;

@Injectable({
    providedIn: 'root',
})
export class OffersDao {
    private allOffers: Offer[];
    private currentSearchOffers: Offer[];

    constructor(private offersConverter: OffersConverter,
        private OffersSorter: OffersSorter) {
        this.allOffers = this.offersConverter.convertToReadableOffers(rawOffers.Oferty.Oferta);
    }

    list(page: number, sorting: Sorting): Offer[] {
        // TODO: Implement filtering.
        this.currentSearchOffers = this.OffersSorter.sortOffers(this.allOffers, sorting);

        const startIndex = page * OFFERS_PER_PAGE; 
        return this.currentSearchOffers.slice(startIndex, startIndex + OFFERS_PER_PAGE);
    }

    getOffersQuantity(): number {
        return this.currentSearchOffers.length;
    }

    getOffersPerPage(): number {
        return OFFERS_PER_PAGE;
    }

    getNumberOfPages(): number {
        const offersOverPageSize = this.currentSearchOffers.length / OFFERS_PER_PAGE; 
        if (this.currentSearchOffers.length % OFFERS_PER_PAGE === 0) {
            return offersOverPageSize - 1;
        }
        return Math.trunc(offersOverPageSize);
    }
}

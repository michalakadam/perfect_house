import { Injectable } from '@angular/core';

import * as rawOffers from "src/offers/offers.json";
import { Offer } from '../shared/models/offer';
import { OffersConverter } from './offers-converter.service';

const OFFERS_PER_PAGE = 50;

@Injectable({
    providedIn: 'root',
})
export class OffersDao {
    private allOffers: Offer[];
    private currentSearchOffers: Offer[];

    constructor(private offersConverter: OffersConverter) {
        this.allOffers = this.offersConverter.convertToReadableOffers(rawOffers.Oferty.Oferta);
    }

    list(page: number): Offer[] {
        // TODO: implement filtering and sorting.
        this.currentSearchOffers = this.allOffers;

        const startIndex = page * OFFERS_PER_PAGE; 
        return this.currentSearchOffers.slice(startIndex, startIndex + OFFERS_PER_PAGE)
    }

    getOffersTotalQuantity(): number {
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
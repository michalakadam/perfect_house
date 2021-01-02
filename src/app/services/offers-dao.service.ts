import { Injectable } from '@angular/core';

import * as rawOffers from "src/offers/offers.json";
import { Offer } from '../shared/models/offer';
import { OffersConverter } from './offers-converter.service';

@Injectable({
    providedIn: 'root',
})
export class OffersDao {
    private offers: Offer[];

    constructor(private offersConverter: OffersConverter) {
        this.offers = this.offersConverter.convertToReadableOffers(rawOffers.Oferty.Oferta);
    }
}
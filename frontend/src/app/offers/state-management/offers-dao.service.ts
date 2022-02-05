import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { Offer } from "src/app/shared/models";
import { default as rawOffers } from "src/offers/offers.json";
import { OffersConverter } from "./offers-converter.service";

@Injectable({
  providedIn: "root",
})
export class OffersDao {
  constructor(private offersConverter: OffersConverter) {}

  loadOffers(): Observable<Offer[]> {
    return observableOf(this.offersConverter.convertToReadableOffers(rawOffers));
  }
}

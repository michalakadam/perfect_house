import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Offer } from "src/app/shared/models";
import { OffersConverter } from "./offers-converter.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class OffersDao {
  constructor(private httpClient: HttpClient, private offersConverter: OffersConverter) {}

  loadOffers(): Observable<Offer[]> {
    // Not reading offers.json directly from filesystem to prevent caching issues.
    return this.httpClient.get("offers/offers.json").pipe(
      map((rawOffers: any[]) => this.offersConverter.convertToReadableOffers(rawOffers)));
  }
}

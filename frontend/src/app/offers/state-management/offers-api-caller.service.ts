import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { retry } from "rxjs/operators";
import { Offer } from "src/app/shared/models";

const OFFERS_API_URL = "https://51.77.195.170:3000/offers";

@Injectable({
  providedIn: "root",
})
export class OffersApiCaller {
  constructor(private httpClient: HttpClient) {}

  loadOffers(): Observable<Offer[]> {
    return this.httpClient.get<Offer[]>(OFFERS_API_URL).pipe(retry(3));
  }
}

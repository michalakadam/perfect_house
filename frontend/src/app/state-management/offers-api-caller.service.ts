import { Injectable } from "@angular/core";
import { StateManagementModule } from "./state-management.module";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Offer } from "src/app/shared/models";

@Injectable({
  providedIn: StateManagementModule,
})
export class OffersApiCaller {
  private offersApiUrl = "http://51.77.195.170:3000/offers";
  offers$: Observable<Offer[]>;

  constructor(private httpClient: HttpClient) {
    this.offers$ = this.httpClient.get<Offer[]>(this.offersApiUrl);
  }
}

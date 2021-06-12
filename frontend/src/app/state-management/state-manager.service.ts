import { Injectable } from "@angular/core";
import { OffersApiCaller } from "./offers-api-caller.service";

@Injectable({
  providedIn: "root",
})
export class StateManager {
  constructor(private offersApiCaller: OffersApiCaller) {}

  offers$ = this.offersApiCaller.offers$;
}

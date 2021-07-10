import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as selectors from "./selectors";

@Injectable({
  providedIn: "root",
})
export class OffersStateManager {
  constructor(private store: Store) {}

  url$: Observable<string> = this.store.select(selectors.getUrl);

  params$: Observable<Params> = this.store.select(selectors.getParams);

  queryParams$: Observable<Params> = this.store.select(
    selectors.getQueryParams
  );
}

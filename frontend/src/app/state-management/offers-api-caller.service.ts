import { Injectable } from "@angular/core";
import { StateManagementModule } from "./state-management.module";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, retry, take } from "rxjs/operators";
import { Offer } from "src/app/shared/models";
import { SnackbarService } from "../shared/services/snackbar.service";

const ERROR_MESSAGE = "Wystąpił niespodziewany błąd w trakcie ładowania ofert.";

@Injectable({
  providedIn: StateManagementModule,
})
export class OffersApiCaller {
  private offersApiUrl = "http://51.77.195.170:3000/offers";
  private offers = new Subject<Offer[]>();
  private isLoading = new BehaviorSubject<boolean>(true);

  offers$: Observable<Offer[]> = this.offers.asObservable();
  isLoading$: Observable<boolean>;

  constructor(
    private httpClient: HttpClient,
    private snackbarService: SnackbarService
  ) {
    this.httpClient
      .get<Offer[]>(this.offersApiUrl)
      .pipe(take(1), retry(3), catchError(this.handleError))
      .subscribe((offers: Offer[]) => {
        this.offers.next(offers);
        this.isLoading.next(false);
      });
  }

  private handleError(error: HttpErrorResponse) {
    this.snackbarService.open(ERROR_MESSAGE);
    if (error.status === 0) {
      // A client-side or network error occurred.
      console.error(`An error occurred: ${error.error}`);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError("Something bad happened; please try again later.");
  }
}

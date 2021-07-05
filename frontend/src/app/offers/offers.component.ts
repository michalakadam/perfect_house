import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SnackbarService } from "../shared/services/snackbar.service";
import {
  Sorting,
  AVAILABLE_SORTINGS,
  DEFAULT_FILTERS,
  Offer,
  OffersFilters,
  DEFAULT_SORTING,
} from "src/app/shared/models";
import { AgentsDao } from "../shared/services/agents-dao.service";
import { WindowSizeDetector } from "../shared/services/window-size-detector.service";
import { OffersStateManager } from "./state-management/state-manager.service";

const computeSortingParameter = (sorting: Sorting): string => {
  return (
    sorting.propertyName +
    "_" +
    (sorting.isAscending ? "ascending" : "descending")
  );
};

const FIRST_PAGE_NUMBER = 1;
export const DEFAULT_PARAMETERS = {
  page: FIRST_PAGE_NUMBER,
  sorting: computeSortingParameter(DEFAULT_SORTING),
};

/** Strona wyświetla oferty nieruchomości oferując możliwość ich zaawansowanego wyszukiwania. */
@Component({
  selector: "perfect-offers",
  templateUrl: "./offers.component.html",
  styleUrls: ["./offers.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersComponent implements OnDestroy {
  private subscription = new Subscription();

  offers: Offer[];
  currentPage: number;
  currentSorting: Sorting;
  currentFilters = DEFAULT_FILTERS;
  isSnackbarVisible = false;
  snackbarContent = "";

  constructor(
    readonly agentsDao: AgentsDao,
    readonly windowSizeDetector: WindowSizeDetector,
    readonly offersStateManager: OffersStateManager,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly snackbarService: SnackbarService
  ) {
    this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
      this.changeDetector.detectChanges();
    });
    this.subscription.add(
      this.snackbarService.open$.subscribe((message) => {
        this.openSnackbar(message);
        setTimeout(() => {
          this.closeSnackbar();
        }, 3000);
      })
    );
    this.subscription.add(
      this.route.params.subscribe((params) => {
        if (
          !params.hasOwnProperty("page") ||
          !params.hasOwnProperty("sorting")
        ) {
          this.router.navigate([
            "oferty",
            { ...DEFAULT_PARAMETERS, ...params },
          ]);
        } else {
          this.loadOffersForCurrentParameters(params);
        }
      })
    );
    this.subscription.add(
      this.offersStateManager.numberOfPages$.subscribe((numberOfPages) => {
        if (this.currentPage > numberOfPages) {
          this.loadNewResults(0, this.currentSorting, this.currentFilters);
        }
      })
    );
  }

  private openSnackbar(message: string) {
    this.snackbarContent = message;
    this.isSnackbarVisible = true;
    this.changeDetector.detectChanges();
  }

  private closeSnackbar() {
    this.snackbarContent = "";
    this.isSnackbarVisible = false;
    this.changeDetector.detectChanges();
  }

  private loadOffersForCurrentParameters(params: any) {
    this.currentPage = this.computePageNumberFromParams(params.page);
    this.currentSorting = this.computeSortingFromParams(params.sorting);
    this.currentFilters = this.computeFiltersFromParams(params);

    if (this.currentPage < 0 || !this.currentSorting) {
      this.router.navigate(["/strona-nie-istnieje"]);
    }
    this.offersStateManager.search(
      this.currentPage,
      this.currentSorting,
      this.currentFilters
    );
  }

  private computePageNumberFromParams(page: string): number {
    return Number.isNaN(Number(page)) ? -1 : Number(page) - 1;
  }

  private computeSortingFromParams(sortingStringified: string): Sorting {
    const propertyName = sortingStringified.split("_")[0];
    const isAscending = sortingStringified.split("_")[1] === "ascending";

    return AVAILABLE_SORTINGS.find(
      (sorting) =>
        sorting.propertyName === propertyName &&
        sorting.isAscending === isAscending
    );
  }

  private computeFiltersFromParams(params: any): OffersFilters {
    let filters = DEFAULT_FILTERS;

    for (const property in DEFAULT_FILTERS) {
      let value = params[property];
      if (value === "true" || value === "false") {
        value = value === "true";
      }
      if (params.hasOwnProperty(property)) {
        filters = { ...filters, [property]: value };
      }
    }
    return filters;
  }

  loadNewResults(page: number, sorting: Sorting, filters: OffersFilters) {
    if (!this.isSearchTheSameAsCurrentOne(page, sorting, filters)) {
      const params = {
        page: page + 1,
        sorting: computeSortingParameter(sorting),
        ...this.computeFiltersParameters(filters),
      };

      this.router.navigate(["oferty", params]);
    }
  }

  private isSearchTheSameAsCurrentOne(
    page: number,
    sorting: Sorting,
    filters: OffersFilters
  ): boolean {
    return (
      page === this.currentPage &&
      JSON.stringify(sorting) === JSON.stringify(this.currentSorting) &&
      JSON.stringify(filters) === JSON.stringify(this.currentFilters)
    );
  }

  private computeFiltersParameters(filters: OffersFilters) {
    let filtersParameters = {};
    for (let property in filters) {
      if (filters[property] !== DEFAULT_FILTERS[property]) {
        filtersParameters = {
          ...filtersParameters,
          [property]: filters[property],
        };
      }
    }
    return filtersParameters;
  }

  loadOffer(symbol: string) {
    this.router.navigate(["oferta", symbol]);
  }

  trackById(index: number, offer: Offer) {
    return offer.id;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { OffersDao } from '../services/offers-dao.service';
import { Offer, Sorting, AVAILABLE_SORTINGS, DEFAULT_FILTERS, OffersFilters } from '../shared/models';

const FIRST_PAGE_NUMBER = 1;
const DEFAULT_SORTING_STRINGIFIED = 'creationDate_descending';
const DEFAULT_PARAMETERS = {
  page: FIRST_PAGE_NUMBER,
  sorting: DEFAULT_SORTING_STRINGIFIED,
}

/** Strona wyświetla oferty nieruchomości oferując możliwość ich zaawansowanego wyszukiwania. */
@Component({
  selector: 'perfect-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersComponent implements OnInit {
  offers: Offer[];
  currentPage: number;
  currentSorting: Sorting;
  currentFilters = DEFAULT_FILTERS;
  isPaginatorVisible = true;

  constructor(readonly offersDao: OffersDao,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.hasOwnProperty('page') || !params.hasOwnProperty('sorting')) {
        this.router.navigate(['oferty', {...DEFAULT_PARAMETERS, ...params}]);
      } else {
        this.loadOffersForCurrentParameters(params);
      }
    });
  }

  private loadOffersForCurrentParameters(params: any) {
    this.currentPage = this.computePageNumberFromParams(params.page);
    this.currentSorting = this.computeSortingFromParams(params.sorting);
    this.currentFilters = this.computeFiltersFromParams(params);

    if (this.currentPage < 0 || !this.currentSorting) {
      this.router.navigate(['/strona-nie-istnieje']);
    }
    this.offers = this.offersDao.list(
      this.currentPage, this.currentSorting, this.currentFilters);
    
    if (this.currentPage > this.offersDao.getNumberOfPages()) {
      this.loadNewResults(0, this.currentSorting, this.currentFilters);
    }
    this.isPaginatorVisible = this.offersDao.getNumberOfPages() > 0;
    this.changeDetector.detectChanges();
  }

  private computePageNumberFromParams(page: string): number {
    return Number.isNaN(Number(page)) ? -1 : (Number(page) - 1);
  }

  private computeSortingFromParams(sortingStringified: string): Sorting {
    const propertyName = sortingStringified.split('_')[0];
    const isAscending = sortingStringified.split('_')[1] === 'ascending';

    return AVAILABLE_SORTINGS.find(sorting =>
      sorting.propertyName ===  propertyName && sorting.isAscending === isAscending
    );
  }

  private computeFiltersFromParams(params: any): OffersFilters {
    let filters = DEFAULT_FILTERS;

    for (const property in DEFAULT_FILTERS) {
      let value = params[property];
      if (value === 'true' || value === 'false') {
        value = value === 'true';
      }
      if (params.hasOwnProperty(property)) {
        filters = {...filters, [property]: value};
      }
    }
    return filters;
  }

  loadNewResults(page: number, sorting: Sorting, filters: OffersFilters) {
    if (!this.isSearchTheSameAsCurrentOne(page, sorting, filters)) {
      const params = {
        page: page + 1,
        sorting: this.computeSortingParameter(sorting),
        ...this.computeFiltersParameters(filters),
      };

      this.router.navigate(['oferty', params]);
    }
  }

  private isSearchTheSameAsCurrentOne(
    page: number, sorting: Sorting, filters: OffersFilters): boolean {
      return page === this.currentPage &&
        JSON.stringify(sorting) === JSON.stringify(this.currentSorting) &&
        JSON.stringify(filters) === JSON.stringify(this.currentFilters);
  }

  private computeSortingParameter(sorting: Sorting): string {
    return sorting.propertyName + '_' +
      (sorting.isAscending ? 'ascending' : 'descending');
  }

  private computeFiltersParameters(filters: OffersFilters) {
    let filtersParameters = {};
    for (let property in filters) {
      if (filters[property] !== DEFAULT_FILTERS[property]) {
        filtersParameters = {...filtersParameters, [property]: filters[property]};
      }
    }
    return filtersParameters;
  }
}

import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { OffersDao } from '../services/offers-dao.service';
import { Offer } from '../shared/models/offer';
import { Sorting, AVAILABLE_SORTINGS } from '../shared/models/sorting';
import { AVAILABLE_TRANSACTIONS } from '../shared/models/transaction';
import { DEFAULT_FILTERS, OffersFilters } from 'src/app/shared/models/filters';

const FIRST_PAGE_NUMBER = 0;

/** Strona wyświetla oferty nieruchomości oferując możliwość ich zaawansowanego wyszukiwania. */
@Component({
  selector: 'perfect-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersComponent {
  offers: Offer[];
  currentPage = FIRST_PAGE_NUMBER;
  currentSorting = AVAILABLE_SORTINGS[0];
  currentTransaction = AVAILABLE_TRANSACTIONS[0];
  currentFilters = DEFAULT_FILTERS;
  isPaginatorVisible = true;

  constructor(readonly offersDao: OffersDao) {
    this.offers = this.offersDao.list(this.currentSorting, this.currentFilters);
    this.isPaginatorVisible = this.offersDao.getNumberOfPages() !== 0;
  }

  applyFilters(filters: OffersFilters) {
    this.currentFilters = filters;
    this.currentPage = FIRST_PAGE_NUMBER;
    this.offers = this.offersDao.list(this.currentSorting, filters);
  }

  listSortedOffers(sorting: Sorting) {
    this.currentSorting = sorting;
    this.currentPage = FIRST_PAGE_NUMBER;
    this.offers = this.offersDao.list(sorting, this.currentFilters);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.offers = this.offersDao.listOffersForPage(page);
  }
}

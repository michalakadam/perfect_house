import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OffersDao } from '../services/offers-dao.service';
import { Offer } from '../shared/models/offer';
import { Sorting, AVAILABLE_SORTINGS } from '../shared/models/sorting';

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
  isPaginatorVisible = true;

  constructor(readonly offersDao: OffersDao) {
    this.offers = this.offersDao.list(this.currentPage, this.currentSorting);
    this.isPaginatorVisible = this.offersDao.getNumberOfPages() !== 0;
  }

  changePage(page: number) {
    this.currentPage = page;
    this.offers = this.offersDao.list(page, this.currentSorting);
  }

  listSortedOffers(sorting: Sorting) {
    this.currentSorting = sorting;
    this.currentPage = FIRST_PAGE_NUMBER;
    this.offers = this.offersDao.list(FIRST_PAGE_NUMBER, sorting);
  }
}

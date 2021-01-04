import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OffersDao } from '../services/offers-dao.service';
import { Offer } from '../shared/models/offer';

/** Strona wyświetla oferty nieruchomości oferując możliwość ich zaawansowanego wyszukiwania. */
@Component({
  selector: 'perfect-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersComponent {
  offers: Offer[];
  currentPage = 0;
  isPaginatorVisible = true;

  constructor(readonly offersDao: OffersDao) {
    this.offers = this.offersDao.list(this.currentPage);
    this.isPaginatorVisible = this.offersDao.getNumberOfPages() !== 0;
  }

  changePage(page: number) {
    this.offers = this.offersDao.list(page);
    this.currentPage = page;
  }
}

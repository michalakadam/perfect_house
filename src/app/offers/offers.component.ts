import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OffersDao } from '../services/offers-dao.service';

/** Strona wyświetla oferty nieruchomości oferując możliwość ich zaawansowanego wyszukiwania. */
@Component({
  selector: 'perfect-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersComponent {

  constructor(readonly offersDao: OffersDao) {}

  paginate(event) {
    // TODO: Implement pagination.
  }
}

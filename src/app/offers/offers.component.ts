import { Component, ChangeDetectionStrategy } from '@angular/core';

/** Strona wyświetla oferty nieruchomości oferując możliwość ich zaawansowanego wyszukiwania. */
@Component({
  selector: 'perfect-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersComponent {}

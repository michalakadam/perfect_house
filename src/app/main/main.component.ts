import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { OffersDao } from '../services/offers-dao.service';
import { DEFAULT_FILTERS, OffersFilters } from '../shared/models';

const IMAGES = [
  {
    "previewImageSrc": "/assets/main_first.jpg",
    "thumbnailImageSrc": "/assets/main_first.jpg",
    "title": "Przejdź do ofert"
  },
  {
    "previewImageSrc": "/assets/main_second.jpg",
    "thumbnailImageSrc": "/assets/main_second.jpg",
    "title": "Sprawdź oferty nad morzem"
  },
]
/** Strona główna. */
@Component({
  selector: 'perfect-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  images = IMAGES;

  constructor(private offersDao: OffersDao,
    private router: Router) {
      this.offersDao.initializeOffersForTheMainPage();
    }

  loadOffers(filters: OffersFilters) {
    this.router.navigate(['oferty', this.computeFiltersParameters(filters)]);
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

  loadOffer(symbol: string) {
    this.router.navigate(['oferta', symbol]);
  }
}

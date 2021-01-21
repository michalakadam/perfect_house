import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { OffersDao } from '../services/offers-dao.service';
import { DEFAULT_FILTERS, OffersFilters } from '../shared/models';

const IMAGES = [
  {
    "previewImageSrc": "/assets/dla_ciebie.jpg",
    "thumbnailImageSrc": "/assets/dla_ciebie.jpg",
    "title": "Sprawdź nasze oferty dla Ciebie."
  },
  {
    "previewImageSrc": "/assets/nad_morzem.jpg",
    "thumbnailImageSrc": "/assets/nad_morzem.jpg",
    "title": "Zobacz inwestycje nad morzem."
  },
  {
    "previewImageSrc": "/assets/po_poznansku.jpg",
    "thumbnailImageSrc": "/assets/po_poznansku.jpg",
    "title": "Sprawdź nasze oferty dla Ciebie."
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

  openUrl(image) {
    let params = {};
    if (image.title.includes('morze')) {
      params = {isByTheSea: true};
    }
    this.router.navigate(['oferty', params]);
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

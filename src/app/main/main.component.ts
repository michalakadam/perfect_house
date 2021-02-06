import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { OffersDao } from '../services/offers-dao.service';
import { WindowSizeDetector } from '../services/window-size-detector.service';
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
  {
    "previewImageSrc": "/assets/zarzadzanie.jpg",
    "thumbnailImageSrc": "/assets/zarzadzanie.jpg",
    "title": "Zobacz, jakie proste może być zarządzanie nieruchomościami."
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
  advancedVisible = false;

  constructor (readonly offersDao: OffersDao, private router: Router,
    readonly windowSizeDetector: WindowSizeDetector, 
    readonly changeDetector: ChangeDetectorRef) {
    this.offersDao.initializeOffersForTheMainPage();
    this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  openUrl(image) {
    if (image.previewImageSrc.includes('zarzadzanie')) {
      this.router.navigate(['zarzadzanie']);
      return;
    }
    if (image.previewImageSrc.includes('poznansku')) {
      this.router.navigate(['wartosci']);
      return;
    }

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

  toggleAdvancedVisible() {
    this.advancedVisible = !this.advancedVisible;
  }

  computeOffersVisible() {
    if (this.windowSizeDetector.isWindowSmallerThanTablet) {
      return 1;
    }
    if (this.windowSizeDetector.isWindowSmallerThanDesktopMedium) {
      return 2;
    }
    if (this.windowSizeDetector.isWindowSmallerThanDesktopLarge) {
      return 3;
    }
    return 4;
  }
}

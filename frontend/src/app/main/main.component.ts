import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { WindowSizeDetector } from "../shared/services/window-size-detector.service";
import {
  DEFAULT_FILTERS,
  GalleryPhoto,
  OffersFilters,
} from "src/app/shared/models";
import { DEFAULT_PARAMETERS } from "../offers/offers.component";
import { OffersStateManager } from "../offers/state-management/state-manager.service";

const IMAGES: GalleryPhoto[] = [
  {
    previewImageSrc: "/assets/dla_ciebie.jpg",
    thumbnailImageSrc: "/assets/dla_ciebie.jpg",
    title: "Sprawdź nasze oferty dla Ciebie.",
  },
  {
    previewImageSrc: "/assets/nad_morzem.jpg",
    thumbnailImageSrc: "/assets/nad_morzem.jpg",
    title: "Zobacz inwestycje nad morzem.",
  },
  {
    previewImageSrc: "/assets/po_poznansku.jpg",
    thumbnailImageSrc: "/assets/po_poznansku.jpg",
    title: "Sprawdź nasze oferty dla Ciebie.",
  },
  {
    previewImageSrc: "/assets/zarzadzanie.jpg",
    thumbnailImageSrc: "/assets/zarzadzanie.jpg",
    title: "Zobacz, jakie proste może być zarządzanie nieruchomościami.",
  },
];
/** Strona główna. */
@Component({
  selector: "perfect-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnDestroy {
  private subscription: Subscription;

  images = IMAGES;
  advancedVisible = false;

  constructor(
    private readonly router: Router,
    readonly offersStateManager: OffersStateManager,
    readonly windowSizeDetector: WindowSizeDetector,
    readonly changeDetector: ChangeDetectorRef
  ) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(
      () => {
        this.changeDetector.detectChanges();
      }
    );
  }

  openUrl(image) {
    if (image.previewImageSrc.includes("zarzadzanie")) {
      this.router.navigate(["zarządzanie"]);
      return;
    }
    if (image.previewImageSrc.includes("poznansku")) {
      this.router.navigate(["wartości"]);
      return;
    }

    let params = {};
    if (image.title.includes("morze")) {
      params = { isByTheSea: true };
    }
    this.router.navigate(["oferty", params]);
  }

  loadOffers(filters: OffersFilters) {
    this.router.navigate([
      "oferty",
      { ...DEFAULT_PARAMETERS, ...this.computeFiltersParameters(filters) },
    ]);
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

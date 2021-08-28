import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { DEFAULT_QUERY_PARAMETERS } from "../offers/state-management/effects";
import { openOffersPage } from "../router/state-management/actions";
import { WindowSizeDetector } from "../shared/services/window-size-detector.service";

/** Stopka strony. Zawiera przydatne linki, informacje kontaktowe i logo firmy. */
@Component({
  selector: "perfect-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnDestroy {
  private subscription: Subscription;

  isRentalSectionOpen = false;
  isSaleSectionOpen = false;
  isOtherSectionOpen = false;

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly store: Store,
  ) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(
      () => {
        this.changeDetector.detectChanges();
      }
    );
  }

  toggleRentalSectionOpen() {
    this.isRentalSectionOpen = !this.isRentalSectionOpen;
    if (this.isRentalSectionOpen) {
      this.isSaleSectionOpen = false;
      this.isOtherSectionOpen = false;
    }
  }

  toggleSaleSectionOpen() {
    this.isSaleSectionOpen = !this.isSaleSectionOpen;
    if (this.isSaleSectionOpen) {
      this.isRentalSectionOpen = false;
      this.isOtherSectionOpen = false;
    }
  }

  toggleOtherSectionOpen() {
    this.isOtherSectionOpen = !this.isOtherSectionOpen;
    if (this.isOtherSectionOpen) {
      this.isRentalSectionOpen = false;
      this.isSaleSectionOpen = false;
    }
  }

  loadOffers(queryParams: any) {
    window.scrollTo(0, 0);
    this.store.dispatch(openOffersPage({queryParams: {...DEFAULT_QUERY_PARAMETERS, ...queryParams}}))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

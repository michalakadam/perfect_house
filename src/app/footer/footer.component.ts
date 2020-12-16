import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { skip } from 'rxjs/operators';
import { WindowSizeDetector } from '../services/window-size-detector.service';

/** Stopka strony. Zawiera przydatne linki, informacje kontaktowe i logo firmy. */
@Component({
  selector: 'perfect-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  isRentalSectionOpen = false;
  isSaleSectionOpen = false;
  isOtherSectionOpen = false;

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    private changeDetector: ChangeDetectorRef) {
    this.windowSizeDetector.windowSizeChanged$
    .pipe(
      // Change of window size at initialization propagates properly.
      skip(1),
    ).subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  toggleRentalSectionOpen() {
    this.isRentalSectionOpen = !this.isRentalSectionOpen;
  }

  toggleSaleSectionOpen() {
    this.isSaleSectionOpen = !this.isSaleSectionOpen;
  }

  toggleOtherSectionOpen() {
    this.isOtherSectionOpen = !this.isOtherSectionOpen;
  }
}

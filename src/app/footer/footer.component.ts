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
    this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
      this.changeDetector.detectChanges();
    });
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
}

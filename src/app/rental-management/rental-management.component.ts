import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { skip } from 'rxjs/operators';
import { WindowSizeDetector } from '../services/window-size-detector.service';

/** Kontener strony 'Zarządzanie najmem'. */
@Component({
  selector: 'perfect-rental-management',
  templateUrl: './rental-management.component.html',
  styleUrls: ['./rental-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RentalManagementComponent {
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
}
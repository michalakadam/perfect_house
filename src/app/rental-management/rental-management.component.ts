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
      this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
        this.changeDetector.detectChanges();
     });
  }
}
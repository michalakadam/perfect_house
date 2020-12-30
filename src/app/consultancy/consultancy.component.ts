import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { WindowSizeDetector } from '../services/window-size-detector.service';

/** Kontener strony 'Doradztwo'. */
@Component({
  selector: 'perfect-consultancy',
  templateUrl: './consultancy.component.html',
  styleUrls: ['./consultancy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultancyComponent {
  constructor (readonly windowSizeDetector: WindowSizeDetector, 
    readonly changeDetector: ChangeDetectorRef) {
    this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }
}

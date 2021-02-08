import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowSizeDetector } from '../services/window-size-detector.service';

/** Kontener strony 'Doradztwo'. */
@Component({
  selector: 'perfect-consultancy',
  templateUrl: './consultancy.component.html',
  styleUrls: ['./consultancy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultancyComponent implements OnDestroy {
  private subscription: Subscription;

  constructor (readonly windowSizeDetector: WindowSizeDetector, 
    readonly changeDetector: ChangeDetectorRef) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

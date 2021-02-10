import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AgentsDao } from 'src/app/services/agents-dao.service';
import { Offer } from 'src/app/shared/models';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { WindowSizeDetector } from 'src/app/services/window-size-detector.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'perfect-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferCardComponent implements OnDestroy {
  private subscription: Subscription;
  displaySmaller = false;

  @Input() offer: Offer;
  @Input()
  set inCarousel(value: boolean) {
    this.displaySmaller = coerceBooleanProperty(value);
  }

  constructor (readonly agentsDao: AgentsDao,
    readonly windowSizeDetector: WindowSizeDetector, 
    readonly changeDetector: ChangeDetectorRef) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

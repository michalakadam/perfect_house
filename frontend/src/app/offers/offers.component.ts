import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../shared/services/snackbar.service';
import { Offer } from 'src/app/shared/models';
import { WindowSizeDetector } from '../shared/services/window-size-detector.service';
import { OffersStateManager } from './state-management/state-manager.service';
import { AgentsStateManager } from '../agents/state-management/state-manager.service';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/** Strona wyświetla oferty nieruchomości oferując możliwość ich zaawansowanego wyszukiwania. */
@Component({
  selector: 'perfect-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersComponent {
  isSearchAvailable = true;
  @Input()
  set disableSearch(value: boolean) {
    this.isSearchAvailable = !coerceBooleanProperty(value);
  }

  constructor(
    readonly agentsStateManager: AgentsStateManager,
    readonly windowSizeDetector: WindowSizeDetector,
    readonly offersStateManager: OffersStateManager,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
  ) {
    this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  loadOffer(symbol: string) {
    this.router.navigate(['oferta', symbol]);
  }

  trackById(index: number, offer: Offer) {
    return offer.id;
  }
}

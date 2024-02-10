import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class OffersComponent implements OnDestroy {
  private subscription = new Subscription();

  isSearchAvailable = true;
  @Input()
  set disableSearch(value: boolean) {
    this.isSearchAvailable = !coerceBooleanProperty(value);
  }
  isSnackbarVisible = false;
  snackbarContent = '';

  constructor(
    readonly agentsStateManager: AgentsStateManager,
    readonly windowSizeDetector: WindowSizeDetector,
    readonly offersStateManager: OffersStateManager,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly snackbarService: SnackbarService,
  ) {
    this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
      this.changeDetector.detectChanges();
    });
    this.subscription.add(
      this.snackbarService.open$.subscribe((message) => {
        this.openSnackbar(message);
        setTimeout(() => {
          this.closeSnackbar();
        }, 3000);
      }),
    );
  }

  private openSnackbar(message: string) {
    this.snackbarContent = message;
    this.isSnackbarVisible = true;
    this.changeDetector.detectChanges();
  }

  private closeSnackbar() {
    this.snackbarContent = '';
    this.isSnackbarVisible = false;
    this.changeDetector.detectChanges();
  }

  loadOffer(symbol: string) {
    this.router.navigate(['oferta', symbol]);
  }

  trackById(index: number, offer: Offer) {
    return offer.id;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

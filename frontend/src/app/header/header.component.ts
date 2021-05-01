import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowSizeDetector } from 'src/app/shared/services/window-size-detector.service';

/** Nagłówek strony. Zawiera logo firmy, numer telefonu oraz nawigację. */
@Component({
  selector: 'perfect-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  private subscription: Subscription;

  @Output() sideMenuToggled = new EventEmitter();
  @Output() aboutUsOptionsToggled = new EventEmitter();

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(
      () => {
        this.changeDetector.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

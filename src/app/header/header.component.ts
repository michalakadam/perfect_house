import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { WindowSizeDetector } from 'src/app/services/window-size-detector.service';
import { debounceTime, skip } from 'rxjs/operators';

/** Nagłówek strony. Zawiera logo firmy, numer telefonu oraz nawigację. */
@Component({
  selector: 'perfect-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {

  constructor(
    public windowSizeDetector: WindowSizeDetector,
    private changeDetector: ChangeDetectorRef) {
    this.windowSizeDetector.windowSizeChanged$
    .pipe(
      skip(1),
      debounceTime(200),
    ).subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }
}

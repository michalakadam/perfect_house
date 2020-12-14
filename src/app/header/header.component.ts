import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { WindowSizeDetector } from 'src/app/services/window-size-detector.service';
import { skip } from 'rxjs/operators';

/** Nagłówek strony. Zawiera logo firmy, numer telefonu oraz nawigację. */
@Component({
  selector: 'perfect-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {

  @Output() sideMenuToggled = new EventEmitter();

  constructor(
    public windowSizeDetector: WindowSizeDetector,
    private changeDetector: ChangeDetectorRef) {
    this.windowSizeDetector.windowSizeChanged$
    .pipe(
      skip(1),
    ).subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }
}

import { Component, HostListener } from '@angular/core';
import { WindowSizeDetector } from 'src/app/services/window-size-detector.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'perfect-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'openCloseSideNavAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ height: 0, width: 0, opacity: 0 }),
            animate('0.1s ease-out', style({ height: 225, width: 200, opacity: 1 })),
          ],
        ),
        transition(
          ':leave', 
          [
            style({ height: 225, width: 200, opacity: 1 }),
            animate('0.1s ease-in', style({ height: 0, width: 0, opacity: 0 })),
          ],
        ),
      ],
    ),
  ],
})
export class AppComponent {
  isSideMenuVisible = false;

  constructor(readonly windowSizeDetector: WindowSizeDetector) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
      this.windowSizeDetector.windowSizeChanged(window.innerWidth);
  }

  toggleSideMenuVisibility() {
    this.isSideMenuVisible = !this.isSideMenuVisible;
  }

  /** 
   * This method should be triggered only on mobile devices!
   * Closes side navigation when any element on the page is touched
   * except for the button that toggles side navigation.
   * @param event is of type TouchEvent but it has to be marked as any
   * because TS uses does not recognize its path property.
   */
  @HostListener('document:touchstart', ['$event'])
  onClick(event: any) {
    if (this.windowSizeDetector.isWindowSmallerThanMobileLarge && this.isSideMenuVisible) {
      const isSideNavButtonClicked = event.path
        .map(element => element.id)
        .includes('sideNavToggleButton');
      if (!isSideNavButtonClicked) {
        this.isSideMenuVisible = false;
      }
    }
  }
}

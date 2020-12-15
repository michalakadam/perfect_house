import { Component, HostListener, OnInit } from '@angular/core';
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
  host: {'(document:click)': 'onClick($event)'},
})
export class AppComponent implements OnInit {
  isSideMenuVisible = false;

  constructor(readonly windowSizeDetector: WindowSizeDetector) {}

  ngOnInit() {
    this.windowSizeDetector.updateWindowSizeFlags(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
      this.windowSizeDetector.updateWindowSizeFlags(window.innerWidth);
  }

  toggleSideMenuVisibility() {
    this.isSideMenuVisible = !this.isSideMenuVisible;
  }

  /** 
   * Closes side navigation when any element on the page is clicked
   * except for button that toggles side navigation.
   */
  onClick(event) {
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

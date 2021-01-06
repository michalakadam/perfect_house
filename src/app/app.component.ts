import { Component, HostListener, OnInit } from '@angular/core';
import { WindowSizeDetector } from 'src/app/services/window-size-detector.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { PrimeNGConfig } from 'primeng/api';
import { ABOUT_US_LINKS, ALL_LINKS } from './header/menu-links';

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
export class AppComponent implements OnInit {
  isSideMenuVisible = false;
  isAboutUsOptionsVisible = false;
  allLinks = ALL_LINKS;
  aboutUsLinks = ABOUT_US_LINKS;

  constructor(readonly windowSizeDetector: WindowSizeDetector,
    private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
      this.windowSizeDetector.windowSizeChanged(window.innerWidth);
  }

  toggleSideMenuVisibility() {
    this.isSideMenuVisible = !this.isSideMenuVisible;
  }
  
  toggleAboutUsOptionsVisibility() {
    if (!this.isAboutUsOptionsVisible) {
      setTimeout(() => this.isAboutUsOptionsVisible = true, 100);
    }
  }

  /** 
   * Closes side navigation when any element on the page is clicked
   * except for button that toggles side navigation.
   * @param event is of type MouseEvent but it has to be marked as any
   * because TS uses default MouseEvent interface, not Angular one.
   * 'path' property does not exist on a default MouseEvent.
   */
  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (this.windowSizeDetector.isWindowSmallerThanMobileLarge && this.isSideMenuVisible) {
      const isSideNavButtonClicked = event.path
        .map(element => element.id)
        .includes('sideNavToggleButton');
      if (!isSideNavButtonClicked) {
        this.isSideMenuVisible = false;
      }
    }
    else if (this.isAboutUsOptionsVisible) {
      this.isAboutUsOptionsVisible = false;
    }
  }
}

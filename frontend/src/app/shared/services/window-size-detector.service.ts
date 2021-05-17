import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Variables describing possible window sizes must match those from src/variables.scss
export const DESKTOP_LARGE = 1470;
export const DESKTOP_MEDIUM = 1240;
export const DESKTOP_SMALL = 1010;
export const TABLET = 760;
export const MOBILE_LARGE = 640;
export const MOBILE = 480;
export const MOBILE_SMALL = 400;

/** Exposes flags describing current window width. */
@Injectable({
  providedIn: 'root',
})
export class WindowSizeDetector {
  private readonly windowSizeChangedSubject = new Subject();

  readonly windowSizeChanged$: Observable<unknown>;
  isWindowSmallerThanDesktopLarge: boolean;
  isWindowSmallerThanDesktopMedium: boolean;
  isWindowSmallerThanDesktopSmall: boolean;
  isWindowSmallerThanTablet: boolean;
  isWindowSmallerThanMobileLarge: boolean;
  isWindowSmallerThanMobile: boolean;
  isWindowSmallerThanMobileSmall: boolean;

  constructor() {
    this.windowSizeChanged$ = this.windowSizeChangedSubject.asObservable();
    this.updateWindowSizeFlags(window.innerWidth);
  }

  windowSizeChanged(windowSize: number) {
    this.updateWindowSizeFlags(windowSize);
    this.windowSizeChangedSubject.next();
  }

  private updateWindowSizeFlags(windowSize: number) {
    this.isWindowSmallerThanDesktopLarge = windowSize < DESKTOP_LARGE;
    this.isWindowSmallerThanDesktopMedium = windowSize < DESKTOP_MEDIUM;
    this.isWindowSmallerThanDesktopSmall = windowSize < DESKTOP_SMALL;
    this.isWindowSmallerThanTablet = windowSize < TABLET;
    this.isWindowSmallerThanMobileLarge = windowSize < MOBILE_LARGE;
    this.isWindowSmallerThanMobile = windowSize < MOBILE;
    this.isWindowSmallerThanMobileSmall = windowSize < MOBILE_SMALL;
  }
}

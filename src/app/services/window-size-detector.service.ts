import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** Exposes flags describing current window width. */
@Injectable({
    providedIn: 'root',
})
export class WindowSizeDetector {
    // Variables describing possible window sizes must match those from src/variables.scss
    private static readonly MOBILE_LARGE = 640;
    private static readonly MOBILE = 480;
    private static readonly MOBILE_SMALL = 400;

    private readonly windowSizeChangedSubject = new Subject();

    readonly windowSizeChanged$: Observable<unknown>;
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
        this.isWindowSmallerThanMobileLarge = windowSize < WindowSizeDetector.MOBILE_LARGE;
        this.isWindowSmallerThanMobile = windowSize < WindowSizeDetector.MOBILE;
        this.isWindowSmallerThanMobileSmall = windowSize < WindowSizeDetector.MOBILE_SMALL;
    }
}
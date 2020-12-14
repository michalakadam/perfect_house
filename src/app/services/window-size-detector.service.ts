import { ChangeDetectorRef, HostListener, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** Exposes variables describing window width. */
@Injectable({
    providedIn: 'root',
})
export class WindowSizeDetector {
    // Variables describing possible window sizes must match those from src/variables.scss
    private static readonly MOBILE_LARGE = 640;

    private readonly windowSizeChangedSubject = new Subject();

    readonly windowSizeChanged$: Observable<unknown>;
    isWindowSmallerThanMobileLarge: boolean;

    constructor() {
        this.windowSizeChanged$ = this.windowSizeChangedSubject.asObservable();
    }

    updateWindowSizeFlags(windowSize: number) {
        this.isWindowSmallerThanMobileLarge = windowSize < WindowSizeDetector.MOBILE_LARGE;
        this.windowSizeChangedSubject.next();
    }
}
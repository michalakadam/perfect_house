import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { WindowSizeDetector } from "src/app/shared/services/window-size-detector.service";
import { trigger, style, animate, transition } from "@angular/animations";
import { PrimeNGConfig } from "primeng/api";
import { ABOUT_US_LINKS, ALL_LINKS } from "./header/menu-links";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { OffersStateManager } from "./offers/state-management/state-manager.service";

@Component({
  selector: "perfect-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [
    trigger("openCloseSideNavAnimation", [
      transition(":enter", [
        style({ height: 0, width: 0, opacity: 0 }),
        animate(
          "0.1s ease-out",
          style({ height: 225, width: 200, opacity: 1 })
        ),
      ]),
      transition(":leave", [
        style({ height: 225, width: 200, opacity: 1 }),
        animate("0.1s ease-in", style({ height: 0, width: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  isSideMenuVisible = false;
  isAboutUsOptionsVisible = false;
  allLinks = ALL_LINKS;
  aboutUsLinks = ABOUT_US_LINKS;

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    readonly offersStateManager: OffersStateManager,
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly primengConfig: PrimeNGConfig
  ) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!this.isUrlTitleComputedInComponent(event.url)) {
          const title = this.getTitle(
            router.routerState,
            router.routerState.root
          ).join(" - ");
          this.titleService.setTitle(title);
        }
      }
    });
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    // Throw setting window size to event loop so that it happens
    // after all components are initialized.
    setTimeout(() => {
      this.windowSizeDetector.windowSizeChanged(window.innerWidth);
    });
  }

  isUrlTitleComputedInComponent(url: string): boolean {
    return (
      (url.startsWith("/ludzie/") && url.length > 8) || url.includes("oferta")
    );
  }

  // Collect title data properties from all child routes.
  getTitle(state, parent: ActivatedRoute) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }
    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.windowSizeDetector.windowSizeChanged(window.innerWidth);
  }

  toggleSideMenuVisibility() {
    this.isSideMenuVisible = !this.isSideMenuVisible;
  }

  toggleAboutUsOptionsVisibility() {
    if (!this.isAboutUsOptionsVisible) {
      setTimeout(() => (this.isAboutUsOptionsVisible = true), 100);
    }
  }

  /**
   * Closes side navigation when any element on the page is clicked
   * except for button that toggles side navigation.
   * @param event is of type MouseEvent but it has to be marked as any
   * because TS uses default MouseEvent interface, not Angular one.
   * 'path' property does not exist on a default MouseEvent.
   */
  @HostListener("document:click", ["$event"])
  onClick(event: any) {
    if (
      this.windowSizeDetector.isWindowSmallerThanDesktopSmall &&
      this.isSideMenuVisible
    ) {
      const isSideNavButtonClicked = event.path
        .map((element) => element.id)
        .includes("sideNavToggleButton");
      if (!isSideNavButtonClicked) {
        this.isSideMenuVisible = false;
      }
    } else if (this.isAboutUsOptionsVisible) {
      this.isAboutUsOptionsVisible = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

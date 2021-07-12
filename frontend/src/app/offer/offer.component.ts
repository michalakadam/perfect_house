import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from "@angular/core";
import { OnDestroy } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { Agent, Offer, OfferField } from "src/app/shared/models";
import { AgentsDao } from "src/app/shared/services/agents-dao.service";
import { SnackbarService } from "../shared/services/snackbar.service";
import { WindowSizeDetector } from "../shared/services/window-size-detector.service";
import { OffersStateManager } from "../offers/state-management/state-manager.service";

@Component({
  selector: "perfect-offer",
  templateUrl: "./offer.component.html",
  styleUrls: ["./offer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  offer: Offer;
  definedOfferFields: OfferField<any>[] = [];
  isGalleryActive = true;
  isMapButtonVisible = false;
  isMapActive = false;
  isVirtualVisitButtonVisible = false;
  isVirtualVisitActive = false;

  constructor(
    readonly agentsDao: AgentsDao,
    readonly windowSizeDetector: WindowSizeDetector,
    private readonly route: ActivatedRoute,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly snackbarService: SnackbarService,
    private readonly offersStateManager: OffersStateManager
  ) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(
      () => {
        this.changeDetector.detectChanges();
      }
    );
  }

  ngOnInit() {
    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        if (params.symbol) {
          this.loadOffer(params.symbol);
        } else {
          this.handleNonexistentOffer();
        }
      })
    );
  }

  private loadOffer(symbol: string) {
    if (this.consistsOnlyOfNumbers(symbol)) {
      this.reloadOfferUsingSymbol(Number(symbol));
    } else {
      this.offersStateManager
        .offerBySymbol$(symbol)
        .pipe(take(1))
        .subscribe((offer) => {
          if (offer) {
            this.offer = offer;
            this.titleService.setTitle(this.offer.title);
            this.definedOfferFields = this.computeDefinedOfferFields();
            this.computeButtonsVisibility();
            this.changeDetector.detectChanges();
          } else {
            this.handleNonexistentOffer(symbol);
          }
        });
    }
  }

  private consistsOnlyOfNumbers(symbol: string) {
    return /^\d+$/.test(symbol);
  }

  private reloadOfferUsingSymbol(offerNumber: number) {
    this.offersStateManager
      .offerByNumber$(offerNumber)
      .subscribe(({ symbol }) => {
        if (symbol) {
          this.router.navigate(["oferta", symbol]);
        } else {
          this.handleNonexistentOffer(offerNumber + "");
        }
      });
  }

  private computeButtonsVisibility() {
    if (this.offer.lattitude && this.offer.longitude) {
      this.isMapButtonVisible = true;
    }
    if (this.offer.virtualVisitUrl) {
      this.isVirtualVisitButtonVisible = true;
    }
  }

  private handleNonexistentOffer(symbol = "") {
    setTimeout(() => {
      this.snackbarService.open(`Oferta ${symbol} nie istnieje.`);
    }, 500);
    this.router.navigate(["/oferty"]);
  }

  private computeDefinedOfferFields(): OfferField<any>[] {
    const symbolField = {
      displayName: "Symbol oferty",
      value: this.offer.symbol,
    };

    return [
      symbolField,
      ...Object.values(this.offer)
        .filter((value) => this.isDefinedOfferField(value))
        .filter((field) => field.displayName !== "Cena za m²"),
    ];
  }

  private isDefinedOfferField(value: any): boolean {
    return this.isOfferField(value) && this.isDefined(value.value);
  }

  // Because of https://stackoverflow.com/a/46703380/11212568 instanceof
  // does not work on interface.
  private isOfferField(value: any): boolean {
    return (
      value &&
      value.hasOwnProperty("displayName") &&
      value.hasOwnProperty("value")
    );
  }

  private isDefined(value: any): boolean {
    if (typeof value === "number") {
      return value > -1;
    }
    return !!value;
  }

  isBoolean(value: any): boolean {
    return typeof value === "boolean";
  }

  navigateToAgentPage(agent: Agent) {
    this.router.navigate(["/ludzie/" + this.computeAgentLink(agent.fullName)]);
  }

  computeAgentLink(agentFullName: string): string {
    return agentFullName.toLowerCase().split(" ").join("-");
  }

  showGallery() {
    if (!this.isGalleryActive) {
      this.isGalleryActive = true;
      this.isMapActive = false;
      this.isVirtualVisitActive = false;
    }
  }

  showMap() {
    if (!this.isMapActive) {
      this.isGalleryActive = false;
      this.isMapActive = true;
      this.isVirtualVisitActive = false;
    }
  }

  showVirtualVisit() {
    if (!this.isVirtualVisitActive) {
      this.isGalleryActive = false;
      this.isMapActive = false;
      this.isVirtualVisitActive = true;
    }
  }

  computePhotoUrls() {
    const photoUrlPrefix = "/offers/";

    return this.offer.photos.map((photo) => photoUrlPrefix + photo);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

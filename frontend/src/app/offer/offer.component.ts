import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Agent, Offer, OfferField } from "src/app/shared/models";
import { WindowSizeDetector } from "../shared/services/window-size-detector.service";
import { OffersStateManager } from "../offers/state-management/state-manager.service";
import { AgentsStateManager } from "../agents/state-management/state-manager.service";
import { Router } from "@angular/router";

@Component({
  selector: "perfect-offer",
  templateUrl: "./offer.component.html",
  styleUrls: ["./offer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent implements OnDestroy {
  private subscription: Subscription;
  offer: Offer;
  definedOfferFields: OfferField<any>[] = [];
  photoUrls: string[] = [];
  isGalleryActive = true;
  isMapActive = false;
  isVirtualVisitActive = false;

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    readonly agentsStateManager: AgentsStateManager,
    readonly offersStateManager: OffersStateManager,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly router: Router
  ) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(
      () => {
        this.changeDetector.detectChanges();
      }
    );
    this.subscription.add(this.offersStateManager.currentOffer$.subscribe((offer: Offer) => {
      this.offer = offer;
      this.definedOfferFields = this.computeDefinedOfferFields(offer);
      this.photoUrls = this.computePhotoUrls(offer);
      this.isGalleryActive = true;
      this.isMapActive = false;
      this.isVirtualVisitActive = false;
    }));
  }

  computeDefinedOfferFields(offer: Offer): OfferField<any>[] {
    if (!offer) {
      return [];
    }
    const symbolField = {
      displayName: "Symbol oferty",
      value: offer.symbol,
    };

    return [
      symbolField,
      ...Object.values(offer)
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

  computePhotoUrls(offer: Offer) {
    const photoUrlPrefix = "/offers/";

    return offer ? offer.photos.map((photo) => photoUrlPrefix + photo) : [];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

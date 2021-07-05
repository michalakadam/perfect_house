import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { WindowSizeDetector } from "src/app/shared/services/window-size-detector.service";
import { OffersFilters, DEFAULT_FILTERS } from "src/app/shared/models";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import {
  DropdownGroup,
  DropdownValue,
} from "./grouped-dropdown/grouped-dropdown.component";
import { OffersStateManager } from "../state-management/state-manager.service";

const AVAILABLE_TRANSACTIONS = [
  {
    label: "sprzedaż",
    value: false,
  },
  {
    label: "wynajem",
    value: true,
  },
];

const AVAILABLE_MARKETS = [
  {
    label: "pierwotny",
    value: 0,
  },
  {
    label: "wtórny",
    value: 1,
  },
];

@Component({
  selector: "perfect-search-tool",
  templateUrl: "./search-tool.component.html",
  styleUrls: ["./search-tool.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchToolComponent implements OnInit, OnChanges, OnDestroy {
  private inputSubject = new Subject();
  private subscription = new Subscription();

  availableTransactions = AVAILABLE_TRANSACTIONS;
  availableMarkets = AVAILABLE_MARKETS;
  showAdvanced = false;

  estateTypesWithSubtypes: DropdownGroup[] = [];
  voivodeshipsWithCounties: DropdownGroup[] = [];
  selectedTransaction: string;
  location: string;
  isForRent: boolean;
  marketToggleValues: number[] = [];
  isInvestment: boolean;
  isByTheSea: boolean;
  isNoCommission: boolean;
  isVirtualVisitAvailable: boolean;
  symbol = "";
  priceFrom: string;
  priceTo: string;
  pricePerSquareMeterFrom: string;
  pricePerSquareMeterTo: string;
  areaFrom: string;
  areaTo: string;
  numberOfRoomsFrom: string;
  numberOfRoomsTo: string;
  floorFrom: string;
  floorTo: string;
  isElevatorAvailable: boolean;
  isParkingAvailable: boolean;
  isTerraceAvailable: boolean;
  isBasementAvailable: boolean;
  isMpzpAvailable: boolean;

  priceRange: number[];

  onMainPage = false;
  @Input()
  set mainPage(value: boolean) {
    this.onMainPage = coerceBooleanProperty(value);
  }
  @Input() filters: OffersFilters = DEFAULT_FILTERS;
  @Input()
  set rawVoivodeshipsWithCounties(value: Map<string, string[]>) {
    this.voivodeshipsWithCounties = this.convertToDropdownGroups(
      value,
      "voivodeship",
      "county"
    );
  }
  @Input()
  set rawEstateTypesWithSubtypes(value: Map<string, string[]>) {
    this.estateTypesWithSubtypes = this.convertToDropdownGroups(
      value,
      "estateType",
      "estateSubtype"
    );
  }
  @Input() lowestPriceForCurrentSearch = 0;
  @Input() highestPriceForCurrentSearch = 0;
  @Output() searchOffers = new EventEmitter<OffersFilters>();
  @Output() openOffer = new EventEmitter<string>();
  @Output() advancedToggled = new EventEmitter();

  private convertToDropdownGroups(
    typesWithSubtypes: Map<string, string[]>,
    typeSelector: string,
    subtypeSelector: string
  ): DropdownGroup[] {
    const convertToDropdownValue = (subtype: string): DropdownValue => ({
      displayName: subtype,
      isSelected: this.filters[subtypeSelector] === subtype,
    });
    const dropdownGroups = [];

    for (let [type, subtypes] of typesWithSubtypes) {
      const dropdownSubtypes = subtypes.map(convertToDropdownValue);

      dropdownGroups.push({
        displayName: type,
        values: dropdownSubtypes,
        isVisible: !!dropdownSubtypes.find((subtype) => subtype.isSelected),
        isSelected:
          this.filters[typeSelector].toLowerCase() === type.toLowerCase(),
      });
    }
    return dropdownGroups;
  }

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    readonly offersStateManager: OffersStateManager,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.subscription.add(
      this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
        this.changeDetector.detectChanges();
      })
    );
  }

  ngOnInit() {
    this.subscription.add(
      this.inputSubject
        .asObservable()
        .pipe(debounceTime(1000))
        .subscribe(() => {
          this.applyFiltersIgnoringPrice();
        })
    );
  }

  onInputProvided() {
    this.inputSubject.next();
  }

  ngOnChanges() {
    this.location = this.filters.location;
    this.isForRent = this.filters.isForRent;
    if (this.filters.isPrimaryMarket) {
      this.marketToggleValues.push(0);
    }
    if (this.filters.isSecondaryMarket) {
      this.marketToggleValues.push(1);
    }
    this.isInvestment = this.filters.isInvestment;
    this.isByTheSea = this.filters.isByTheSea;
    this.isNoCommission = this.filters.isNoCommission;
    this.isVirtualVisitAvailable = this.filters.isVirtualVisitAvailable;
    this.priceFrom =
      this.filters.priceFrom > -1
        ? this.computeFieldValue(this.filters.priceFrom)
        : this.computeFieldValue(this.lowestPriceForCurrentSearch);
    this.priceTo =
      this.filters.priceTo > -1
        ? this.computeFieldValue(this.filters.priceTo)
        : this.computeFieldValue(this.highestPriceForCurrentSearch);
    this.pricePerSquareMeterFrom = this.computeFieldValue(
      this.filters.pricePerSquareMeterFrom
    );
    this.pricePerSquareMeterTo = this.computeFieldValue(
      this.filters.pricePerSquareMeterTo
    );
    this.areaFrom = this.computeFieldValue(this.filters.areaFrom);
    this.areaTo = this.computeFieldValue(this.filters.areaTo);
    this.numberOfRoomsFrom = this.computeFieldValue(
      this.filters.numberOfRoomsFrom
    );
    this.numberOfRoomsTo = this.computeFieldValue(this.filters.numberOfRoomsTo);
    this.floorFrom = this.computeFieldValue(this.filters.floorFrom);
    this.floorTo = this.computeFieldValue(this.filters.floorTo);
    this.isElevatorAvailable = this.filters.isElevatorAvailable;
    this.isParkingAvailable = this.filters.isParkingAvailable;
    this.isTerraceAvailable = this.filters.isTerraceAvailable;
    this.isBasementAvailable = this.filters.isBasementAvailable;
    this.isMpzpAvailable = this.filters.isMpzpAvailable;

    this.changeDetector.detectChanges();
  }

  isOptionalElementVisible() {
    return (
      !this.windowSizeDetector.isWindowSmallerThanDesktopSmall ||
      (this.windowSizeDetector.isWindowSmallerThanDesktopSmall &&
        this.showAdvanced)
    );
  }

  private computeFieldValue(value: number): string {
    return value === -1 ? "" : "" + value;
  }

  toggleAdvancedVisibility() {
    this.showAdvanced = !this.showAdvanced;
    this.advancedToggled.emit();
  }

  updatePrices(prices: number[]) {
    this.priceFrom = this.computeFieldValue(prices[0]);
    this.priceTo = this.computeFieldValue(prices[1]);
    if (!this.mainPage) {
      this.applyFilters();
    }
  }

  applyFiltersIgnoringPrice() {
    if (this.onMainPage) {
      return;
    }
    this.priceFrom = "-1";
    this.priceTo = "-1";

    this.search();
  }

  applyFilters() {
    if (this.onMainPage) {
      return;
    }

    this.search();
  }

  search() {
    if (this.symbol) {
      this.openOffer.emit(this.symbol);
      return;
    }
    if (
      this.computeFilterNumericValue(this.priceFrom) ===
      this.lowestPriceForCurrentSearch
    ) {
      this.priceFrom = "-1";
    }
    if (
      this.computeFilterNumericValue(this.priceTo) ===
      this.highestPriceForCurrentSearch
    ) {
      this.priceTo = "-1";
    }

    const filters: OffersFilters = {
      estateType: this.getSelectedDropdownGroupName(
        this.estateTypesWithSubtypes
      ),
      estateSubtype: this.getSelectedDropdownValueName(
        this.estateTypesWithSubtypes
      ),
      isForRent: this.isForRent,
      isPrimaryMarket: this.marketToggleValues.indexOf(0) > -1,
      isSecondaryMarket: this.marketToggleValues.indexOf(1) > -1,
      voivodeship: this.getSelectedDropdownGroupName(
        this.voivodeshipsWithCounties
      ),
      county: this.getSelectedDropdownValueName(this.voivodeshipsWithCounties),
      location: this.location,
      isInvestment: this.isInvestment,
      isByTheSea: this.isByTheSea,
      isNoCommission: this.isNoCommission,
      isVirtualVisitAvailable: this.isVirtualVisitAvailable,
      priceFrom: this.computeFilterNumericValue(this.priceFrom),
      priceTo: this.computeFilterNumericValue(this.priceTo),
      pricePerSquareMeterFrom: this.computeFilterNumericValue(
        this.pricePerSquareMeterFrom
      ),
      pricePerSquareMeterTo: this.computeFilterNumericValue(
        this.pricePerSquareMeterTo
      ),
      areaFrom: this.computeFilterNumericValue(this.areaFrom),
      areaTo: this.computeFilterNumericValue(this.areaTo),
      numberOfRoomsFrom: this.computeFilterNumericValue(this.numberOfRoomsFrom),
      numberOfRoomsTo: this.computeFilterNumericValue(this.numberOfRoomsTo),
      floorFrom: this.computeFilterNumericValue(this.floorFrom),
      floorTo: this.computeFilterNumericValue(this.floorTo),
      isElevatorAvailable: this.isElevatorAvailable,
      isParkingAvailable: this.isParkingAvailable,
      isTerraceAvailable: this.isTerraceAvailable,
      isBasementAvailable: this.isBasementAvailable,
      isMpzpAvailable: this.isMpzpAvailable,
    };

    this.filters = filters;
    this.searchOffers.emit(filters);
  }

  private getSelectedDropdownGroupName(groups: DropdownGroup[]): string {
    return groups.find((group) => group.isSelected)?.displayName || "";
  }

  private getSelectedDropdownValueName(groups: DropdownGroup[]): string {
    return (
      groups.flatMap((group) => group.values).find((value) => value.isSelected)
        ?.displayName || ""
    );
  }

  computeFilterNumericValue(value: string): number {
    return value ? Number(value) : -1;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { OffersDao } from 'src/app/shared/services/offers-dao.service';
import { WindowSizeDetector } from 'src/app/shared/services/window-size-detector.service';
import { AVAILABLE_ESTATE_TYPES, EstateType, OffersFilters, DEFAULT_FILTERS } from 'src/app/shared/models';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DropdownGroup, DropdownValue } from './grouped-dropdown/grouped-dropdown.component';

const AVAILABLE_TRANSACTIONS = [
  {
    label: 'sprzedaż',
    value: false,
  },
  {
    label: 'wynajem',
    value: true,
  },
];

const AVAILABLE_MARKETS = [
  {
    label: 'pierwotny',
    value: 0,
  },
  {
    label: 'wtórny',
    value: 1,
  },
];

@Component({
  selector: 'perfect-search-tool',
  templateUrl: './search-tool.component.html',
  styleUrls: ['./search-tool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchToolComponent implements OnInit, OnChanges, OnDestroy {
  private inputSubject: Subject<void> = new Subject();
  private subscription = new Subscription();

  availableEstateTypes = AVAILABLE_ESTATE_TYPES;
  availableTransactions = AVAILABLE_TRANSACTIONS;
  availableMarkets = AVAILABLE_MARKETS;
  availableVoivodeships = [];
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
  symbol = '';
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
  @Output() searchOffers = new EventEmitter<OffersFilters>();
  @Output() openOffer = new EventEmitter<string>();
  @Output() advancedToggled = new EventEmitter();

  offersDao: OffersDao;

  constructor(offersDaoExternal: OffersDao,
    readonly windowSizeDetector: WindowSizeDetector,
    private changeDetector: ChangeDetectorRef) {
      this.offersDao = offersDaoExternal;
    this.subscription.add(this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
      this.changeDetector.detectChanges();
    }));
  }

  ngOnInit() {
    this.subscription.add(this.inputSubject.asObservable()
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.applyFiltersIgnoringPrice();
      })
    );
  }

  onInputProvided(){
    this.inputSubject.next();
  }

  ngOnChanges() {
    if (!this.estateTypesWithSubtypes.length) {
      this.computeEstateTypesWithSubtypes(); 
    }
    if (!this.voivodeshipsWithCounties.length) {
      this.computeVoivodeshipsWithCounties();
    }
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
    this.priceFrom = this.filters.priceFrom > -1 ?
      this.computeFieldValue(this.filters.priceFrom) :
      this.computeFieldValue(this.offersDao.getLowestPriceForCurrentSearch());
    this.priceTo = this.filters.priceTo > -1 ?
      this.computeFieldValue(this.filters.priceTo) :
      this.computeFieldValue(this.offersDao.getHighestPriceForCurrentSearch());
    this.pricePerSquareMeterFrom = this.computeFieldValue(this.filters.pricePerSquareMeterFrom);
    this.pricePerSquareMeterTo = this.computeFieldValue(this.filters.pricePerSquareMeterTo);
    this.areaFrom = this.computeFieldValue(this.filters.areaFrom);
    this.areaTo = this.computeFieldValue(this.filters.areaTo);
    this.numberOfRoomsFrom = this.computeFieldValue(this.filters.numberOfRoomsFrom);
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

  private computeEstateTypesWithSubtypes() {
    for (const estateType of this.availableEstateTypes) {
      const subtypes = this.getEstateSubtypesForDropdown(estateType);

      this.estateTypesWithSubtypes.push({
        displayName: estateType.displayName.toLowerCase(),
        values: subtypes,
        isVisible: !!subtypes.find(subtype => subtype.isSelected),
        isSelected: estateType.displayName.toLowerCase() === this.filters.estateType.toLowerCase(),          
      });   
    }
  }

  private getEstateSubtypesForDropdown(estateType: EstateType): DropdownValue[] {
    const subtypes = estateType.displayName === 'mieszkanie' ? 
        this.offersDao.getBuildingTypesForEstateType(estateType.queryName) :
        this.offersDao.getEstateSubtypesForEstateType(estateType.queryName); 

    return subtypes.map(subtype => {
      return {
        displayName: subtype,
        isSelected: subtype === this.filters.estateSubtype,
      };
    });
  }

  private computeVoivodeshipsWithCounties() {
    for (const voivodeship of this.offersDao.getAvailableVoivodeships()) {
      const counties = this.getCountiesForDropdown(voivodeship);

      this.voivodeshipsWithCounties.push({
        displayName: voivodeship,
        values: counties,
        isVisible: !!counties.find(county => county.isSelected),
        isSelected: this.filters.voivodeship.toLowerCase() === voivodeship.toLowerCase(),
      });
    }
  }

  private getCountiesForDropdown(voivodeship: string): DropdownValue[] {
    return this.offersDao.getCountiesForVoivodeship(voivodeship).map(county => {
      return {
        displayName: county,
        isSelected: this.filters.county === county,
      }
    });
  }

  isOptionalElementVisible() {
    return !this.windowSizeDetector.isWindowSmallerThanDesktopSmall ||
      this.windowSizeDetector.isWindowSmallerThanDesktopSmall && this.showAdvanced;
  }

  private computeFieldValue(value: number): string {
    return value === -1 ? '' : '' + value;
  }

  toggleAdvancedVisibility() {
    this.showAdvanced = !this.showAdvanced;
    this.advancedToggled.emit();
  }

  updatePrices(prices: number[]) {
    this.priceFrom = this.computeFieldValue(prices[0]);
    this.priceTo = this.computeFieldValue(prices[1]);
  }

  applyFiltersIgnoringPrice() {
    if (this.onMainPage) {
      return;
    }
    this.priceFrom = '-1';
    this.priceTo = '-1';

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
    if (this.computeFilterNumericValue(this.priceFrom) ===
      this.offersDao.getLowestPriceForCurrentSearch()) {
        this.priceFrom = '-1';
    }
    if (this.computeFilterNumericValue(this.priceTo) ===
      this.offersDao.getHighestPriceForCurrentSearch()) {
        this.priceTo = '-1';
    }
    
    const filters: OffersFilters = {
      estateType: this.getSelectedDropdownGroupName(this.estateTypesWithSubtypes),
      estateSubtype: this.getSelectedDropdownValueName(this.estateTypesWithSubtypes),
      isForRent: this.isForRent,
      isPrimaryMarket: this.marketToggleValues.indexOf(0) > -1,
      isSecondaryMarket: this.marketToggleValues.indexOf(1) > -1,
      voivodeship: this.getSelectedDropdownGroupName(this.voivodeshipsWithCounties),
      county: this.getSelectedDropdownValueName(this.voivodeshipsWithCounties),
      location: this.location,
      isInvestment: this.isInvestment,
      isByTheSea: this.isByTheSea,
      isNoCommission: this.isNoCommission,
      isVirtualVisitAvailable: this.isVirtualVisitAvailable,
      priceFrom: this.computeFilterNumericValue(this.priceFrom),
      priceTo: this.computeFilterNumericValue(this.priceTo),
      pricePerSquareMeterFrom: this.computeFilterNumericValue(this.pricePerSquareMeterFrom),
      pricePerSquareMeterTo: this.computeFilterNumericValue(this.pricePerSquareMeterTo),
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
    return groups.find(group => group.isSelected)?.displayName || '';
  }

  private getSelectedDropdownValueName(groups: DropdownGroup[]): string {
    return groups.flatMap(group => group.values).find(value => value.isSelected)?.displayName || '';
  }

  computeFilterNumericValue(value: string): number {
    return value ? Number(value) : -1;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

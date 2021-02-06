import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { OffersDao } from 'src/app/services/offers-dao.service';
import { WindowSizeDetector } from 'src/app/services/window-size-detector.service';
import { AVAILABLE_TRANSACTIONS, Transaction, AVAILABLE_ESTATE_TYPES, Estate, OffersFilters, DEFAULT_FILTERS } from 'src/app/shared/models';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const AVAILABLE_VOIVODESHIPS = [
  'cała Polska', 'dolnośląskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie',
  'łódzkie', 'małopolskie', 'mazowieckie', 'opolskie', 'podkarpackie', 'podlaskie',
  'pomorskie', 'śląskie', 'świętokrzyskie', 'warmińsko-mazurskie', 'wielkopolskie',
  'zachodniopomorskie',
];

const AVAILABLE_MARKETS = [
  {
    displayName: 'pierwotny',
    value: 0,
  },
  {
    displayName: 'wtórny',
    value: 1,
  }
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
  availableVoivodeships = AVAILABLE_VOIVODESHIPS;
  availableMarkets = AVAILABLE_MARKETS;
  showAdvanced = false;

  selectedEstateType: Estate;
  selectedTransaction: Transaction;
  selectedVoivodeship: string;
  location: string;
  isPrimaryMarket: boolean;
  isSecondaryMarket: boolean;
  marketValues: number[] = [];
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
      }));
  }

  onInputProvided(){
    this.inputSubject.next();
  }

  ngOnChanges() {
    this.selectedEstateType = this.availableEstateTypes.find(estateType => {
      return estateType.displayName === this.filters.estateType;
    });
    this.selectedTransaction = this.availableTransactions.find(transaction => {
      return transaction.isForRent === this.filters.isForRent;
    }); 
    this.selectedVoivodeship = this.filters.voivodeship;
    this.location = this.filters.location;
    this.isPrimaryMarket = this.filters.isPrimaryMarket;
    this.isSecondaryMarket = this.filters.isSecondaryMarket;
    if (this.isPrimaryMarket) {
      this.marketValues.push(0);
    }
    if (this.isSecondaryMarket) {
      this.marketValues.push(1);
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
      estateType: this.selectedEstateType.displayName,
      isForRent: this.selectedTransaction.isForRent,
      isPrimaryMarket: this.marketValues.indexOf(0) > -1,
      isSecondaryMarket: this.marketValues.indexOf(1) > -1,
      voivodeship: this.selectedVoivodeship,
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

  computeFilterNumericValue(value: string): number {
    return value ? Number(value) : -1;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

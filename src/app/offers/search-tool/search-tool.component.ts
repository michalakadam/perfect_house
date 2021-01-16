import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { OffersDao } from 'src/app/services/offers-dao.service';
import { AVAILABLE_TRANSACTIONS, Transaction, AVAILABLE_ESTATE_TYPES, Estate, OffersFilters } from 'src/app/shared/models';
import { trigger, style, animate, transition } from '@angular/animations';

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
  animations: [
    trigger(
      'openCloseAdvanced', 
      [
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('0.25s ease', style({ height: 50, opacity: 1 })),
          ],
        ),
        transition(
          ':leave', 
          [
            style({ height: 50, opacity: 1 }),
            animate('0.25s ease', style({ height: 0, opacity: 0 })),
          ],
        ),
      ],
    ),
  ],
})
export class SearchToolComponent implements OnChanges {
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

  priceRange: number[];
  

  @Input() filters: OffersFilters;
  @Output() searchOffers = new EventEmitter<OffersFilters>();
  @Output() openOffer = new EventEmitter<string>();

  constructor(readonly offersDao: OffersDao,
    private changeDetector: ChangeDetectorRef) {}

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
    this.priceRange = [
      this.computeFilterNumericValue(this.priceFrom),
      this.computeFilterNumericValue(this.priceTo)
    ];
    this.pricePerSquareMeterFrom = this.computeFieldValue(this.filters.pricePerSquareMeterFrom);
    this.pricePerSquareMeterTo = this.computeFieldValue(this.filters.pricePerSquareMeterTo);
    this.areaFrom = this.computeFieldValue(this.filters.areaFrom);
    this.areaTo = this.computeFieldValue(this.filters.areaTo);
    this.numberOfRoomsFrom = this.computeFieldValue(this.filters.numberOfRoomsFrom);
    this.numberOfRoomsTo = this.computeFieldValue(this.filters.numberOfRoomsTo);
    this.floorFrom = this.computeFieldValue(this.filters.floorFrom);
    this.floorTo = this.computeFieldValue(this.filters.floorTo);
    this.changeDetector.detectChanges();
  }

  private computeFieldValue(value: number): string {
    return value === -1 ? '' : '' + value;
  }

  toggleAdvancedVisibility() {
    this.showAdvanced = !this.showAdvanced;
  }

  updatePriceFrom(priceFromString: string) {
    let priceFrom = this.computeFilterNumericValue(priceFromString);
    if (priceFrom < this.offersDao.getLowestPriceForCurrentSearch()) {
      priceFrom = this.offersDao.getLowestPriceForCurrentSearch();
    }
    if (priceFrom > this.offersDao.getHighestPriceForCurrentSearch()) {
      priceFrom = this.offersDao.getHighestPriceForCurrentSearch();
    }
    this.priceRange = [priceFrom, this.computeFilterNumericValue(this.priceTo)];
    this.changeDetector.detectChanges();
  }

  updatePriceTo(priceToString: string) {
    let priceTo = this.computeFilterNumericValue(priceToString);
    if (priceTo < this.offersDao.getLowestPriceForCurrentSearch()) {
      priceTo = this.offersDao.getLowestPriceForCurrentSearch();
    }
    if (priceTo > this.offersDao.getHighestPriceForCurrentSearch()) {
      priceTo = this.offersDao.getHighestPriceForCurrentSearch();
    }
    this.priceRange = [this.computeFilterNumericValue(this.priceFrom), priceTo];
    this.changeDetector.detectChanges();
  }

  updatePrices(event) {
    this.priceFrom = this.computeFieldValue(event.values[0]);
    this.priceTo = this.computeFieldValue(event.values[1]);
  }

  applyFiltersIgnoringPrice() {
    this.priceFrom = '-1';
    this.priceTo = '-1';

    this.applyFilters();
  }

  applyFilters() {
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
    };

    this.filters = filters;
    this.searchOffers.emit(filters);
  }

  private computeFilterNumericValue(value: string): number {
    return value ? Number(value) : -1;
  }
}

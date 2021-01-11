import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { AVAILABLE_TRANSACTIONS, Transaction, AVAILABLE_ESTATE_TYPES, Estate, OffersFilters } from 'src/app/shared/models';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchToolComponent implements OnChanges {
  availableEstateTypes = AVAILABLE_ESTATE_TYPES;
  availableTransactions = AVAILABLE_TRANSACTIONS;
  availableVoivodeships = AVAILABLE_VOIVODESHIPS;
  availableMarkets = AVAILABLE_MARKETS;

  selectedEstateType: Estate;
  selectedTransaction: Transaction;
  selectedVoivodeship: string;
  location: string;
  isPrimaryMarket: boolean;
  isSecondaryMarket: boolean;
  marketValues: number[] = [];
  isInvestment: boolean;
  isByTheSea: boolean;
  isSpecial: boolean;
  isNoCommission: boolean;
  isVirtualVisitAvailable: boolean;
  symbol = '';

  @Input() filters: OffersFilters;
  @Output() searchOffers = new EventEmitter<OffersFilters>();
  @Output() openOffer = new EventEmitter<string>();

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
    this.isSpecial = this.filters.isSpecial;
    this.isNoCommission = this.filters.isNoCommission;
    this.isVirtualVisitAvailable = this.filters.isVirtualVisitAvailable;
  }

  applyFilters() {
    if (this.symbol) {
      this.openOffer.emit(this.symbol);
      return;
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
      isSpecial: this.isSpecial,
      isNoCommission: this.isNoCommission,
      isVirtualVisitAvailable: this.isVirtualVisitAvailable,
    };

    this.filters = filters;
    this.searchOffers.emit(filters);
  }
}

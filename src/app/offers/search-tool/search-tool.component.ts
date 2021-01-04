import { Component, ChangeDetectionStrategy, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AVAILABLE_TRANSACTIONS, Transaction } from 'src/app/shared/models/transaction';
import { AVAILABLE_ESTATE_TYPES, Estate } from 'src/app/shared/models/estate';
import { OffersFilters, DEFAULT_FILTERS } from 'src/app/shared/models/filters';

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
export class SearchToolComponent implements OnInit {
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

  @Input() filters = DEFAULT_FILTERS;
  @Output() searchButtonClicked = new EventEmitter<OffersFilters>();

  ngOnInit() {
    this.selectedEstateType = this.availableEstateTypes.find(estateType => {
      return estateType.queryName === this.filters.estateType;
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

  }

  applyFilters() {
    const filters: OffersFilters = {
      estateType: this.selectedEstateType.queryName,
      isForRent: this.selectedTransaction.isForRent,
      isPrimaryMarket: this.marketValues.indexOf(0) > -1,
      isSecondaryMarket: this.marketValues.indexOf(1) > -1,
      voivodeship: this.selectedVoivodeship,
      location: this.location,
    };

    this.filters = filters;
    this.searchButtonClicked.emit(filters);
  }
}

export interface OffersFilters {
    estateType: string;
    isForRent: boolean;
    isPrimaryMarket: boolean;
    isSecondaryMarket: boolean;
    voivodeship: string;
    location: string;
    isInvestment: boolean;
    isByTheSea: boolean;
    isSpecial: boolean;
    isNoCommission: boolean;
    isVirtualVisitAvailable: boolean;
};

export const DEFAULT_FILTERS = {
    estateType: 'wszystkie',
    isForRent: false,
    isPrimaryMarket: false,
    isSecondaryMarket: true,
    voivodeship: 'cała Polska',
    location: '',
    isInvestment: false,
    isByTheSea: false,
    isSpecial: false,
    isNoCommission: false,
    isVirtualVisitAvailable: false,
};

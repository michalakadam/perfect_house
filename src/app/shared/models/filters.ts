export interface OffersFilters {
    estateType: string;
    isForRent: boolean;
    isPrimaryMarket: boolean;
    isSecondaryMarket: boolean;
    voivodeship: string;
    location: string;
};

export const DEFAULT_FILTERS = {
    estateType: 'wszystkie',
    isForRent: false,
    isPrimaryMarket: false,
    isSecondaryMarket: true,
    voivodeship: 'cała Polska',
    location: '',
};

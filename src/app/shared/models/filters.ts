export interface OffersFilters {
    estateType: string;
    isForRent: boolean;
    isPrimaryMarket: boolean;
    isSecondaryMarket: boolean;
    voivodeship: string;
    location: string;
    isInvestment: boolean;
    isByTheSea: boolean;
    isNoCommission: boolean;
    isVirtualVisitAvailable: boolean;
    priceFrom: number;
    priceTo: number;
    pricePerSquareMeterFrom: number;
    pricePerSquareMeterTo: number;
    areaFrom: number;
    areaTo: number;
    numberOfRoomsFrom: number;
    numberOfRoomsTo: number;
    floorFrom: number;
    floorTo: number;
    isElevatorAvailable: boolean;
    isParkingAvailable: boolean;
    isTerraceAvailable: boolean;
    isBasementAvailable: boolean;
    isMpzpAvailable: boolean;
};

export const DEFAULT_FILTERS = {
    estateType: '',
    isForRent: false,
    isPrimaryMarket: true,
    isSecondaryMarket: true,
    voivodeship: '',
    location: '',
    isInvestment: false,
    isByTheSea: false,
    isNoCommission: false,
    isVirtualVisitAvailable: false,
    priceFrom: -1,
    priceTo: -1,
    pricePerSquareMeterFrom: -1,
    pricePerSquareMeterTo: -1,
    areaFrom: -1,
    areaTo: -1,
    numberOfRoomsFrom: -1,
    numberOfRoomsTo: -1,
    floorFrom: -1,
    floorTo: -1,
    isElevatorAvailable: false,
    isParkingAvailable: false,
    isTerraceAvailable: false,
    isBasementAvailable: false,
    isMpzpAvailable: false,
};

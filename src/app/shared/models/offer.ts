import { Room } from "./room";

export interface Offer {
    id: number;
    estateType: string;
    agentId: number;
    title: string;
    description: string;
    additionalDescription: string;
    additionalRemarks: string;
    releaseDate: string,
    releaseDateTitle: string,
    number: number;
    symbol: string;
    status: string;
    legalStatus: string;
    standard: number;
    isAlarmSet: boolean;
    isExclusive: boolean;
    isForRent: boolean
    photos: string[];
    isZeroProvisionAvailable: boolean;
    isAvailableOnFacebook: boolean;
    parentOfferId: number,
    creationDate: string;
    updateDate: string;
    expirationDate: string;

    price: number;
    pricePerSquareMeter: number;
    pricePerUsableSquareMeter: number;
    rentPrice: number;
    grossRentPricePerSquareMeter: number;
    netRentPricePerSquareMeter: number;
    deposit: number;
    depositType: string;
    additionalFees: string[];
    garagePrice: number;

    country: string;
    voivodeship: string;
    county: string;
    city: string;
    district: string;
    postalCode: string;
    street: string;
    location: string;
    mapLongtitude: string;
    mapLatitude: string;
    publicTransport: string[];
    neighbourhood: string;
    accessRoad: string;
    distance: number;

    totalArea: number;
    landArea: number;
    usableArea: number;
    terraceArea: number;
    officeArea: number;
    officeBuildingArea: number;
    floorArea: number;

    garage: string;
    buildingName: string;
    gasConnectionDetails: string; 
    numberOfRooms: number;
    numberOfBedrooms: number;
    numberOfTerraces: number;
    numberOfFloors: number;
    floor: string;
    floorHeight: number;
    isBasementAvailable: boolean;
    sewageConnectionDetails: string; 
    burden: string,
    heatingType: string;
    windowsType: string;
    isMarketPrimary: boolean;
    acquisitionType: string;
    rooms: Room[];
    officeBuildingCategory: string;
    electricityConnectionDetails: string;
    buildingType: string;
    flatType: string;
    yearBuilt: number;
    isTerraceAvailable: boolean;
    flatSetUp: string[];
    waterConnectionDetails: string; 
    roomsHeight: number;
    isParkingAvailable: boolean;
    isFenceAvailable: boolean;
    isElevatorAvailable: boolean;
    isAccessible: boolean;
    minimumRentingPeriodInMonths: number;
    predestination: string[];
    isReceptionAvailable: boolean;
    isComputerNetworkAvailable: boolean;
    securityType: string;
    entrance: string;
    noiseLevel: string;
    constructionTechnology: string;
    // Fields related to halls:
    isFloorDustFree: boolean;
    isLoadingRampAvailable: boolean;
    warehouseArea: number;
    warehouseYardArea: number;
    isYardHardened: boolean;
    isManeuveringAreaAvailable: boolean;
    isTruckParkingAvailable: boolean;
    isGantryAvailable: boolean;
    isGoodsLiftAvailable: boolean;
    // Fields related to premises:
    premiseState: string;
    premiseType: string;
    premiseBackRoomArea: number;
    premiseSalesRoomArea: number;
    // Fields related to land lots:
    mpzp: string;
    mpzpInfo: string;
    landLotUse: string;
    landLotDetailedSize: string;
    landLotConstructionConditions: string;
    landLotForm: string;
    landLotFrontLineWidth: number;
    landLotShape: string;
    landLotLegalStatus: string;
    landLotFenceType: string;
    landLotBuildings: string;
}
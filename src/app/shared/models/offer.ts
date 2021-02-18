import { EstateSubtypes } from "./estate-subtype";
import { OfferField } from "./offer-field";
import { Room } from "./room";

export interface Offer {
    id: number;
    estateType: string;
    estateSubtypes: EstateSubtypes;
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
    legalStatus: OfferField<string>;
    standard: OfferField<number>;
    isAlarmSet: OfferField<boolean>;
    isExclusive: boolean;
    isForRent: boolean
    photos: string[];
    isNoCommission: boolean;
    isAvailableOnFacebook: boolean;
    parentOfferId: number,
    creationDate: string;
    updateDate: string;
    expirationDate: string;
    virtualVisitUrl: string;

    price: number;
    pricePerSquareMeter: OfferField<number>;
    pricePerUsableSquareMeter: OfferField<number>;
    rentPrice: OfferField<number>;
    grossRentPricePerSquareMeter: OfferField<number>;
    netRentPricePerSquareMeter: OfferField<number>;
    deposit: OfferField<number>;
    depositType: OfferField<string>;
    additionalFees: string[];
    garagePrice: OfferField<number>;

    country: string;
    voivodeship: string;
    county: string;
    city: string;
    district: string;
    fullLocation: string;
    postalCode: string;
    street: string;
    location: string;
    mapLongtitude: string;
    mapLatitude: string;
    publicTransport: string[];
    neighbourhood: OfferField<string>;
    accessRoad: OfferField<string>;

    totalArea: OfferField<number>;
    landArea: OfferField<number>;
    usableArea: OfferField<number>;
    terraceArea: OfferField<number>;
    officeArea: OfferField<number>;
    officeBuildingArea: OfferField<number>;
    floorArea: OfferField<number>;

    garage: OfferField<string>;
    buildingName: OfferField<string>;
    gasConnectionDetails: OfferField<string>; 
    numberOfRooms: OfferField<number>;
    numberOfBedrooms: OfferField<number>;
    numberOfTerraces: OfferField<number>;
    numberOfFloors: OfferField<number>;
    floor: OfferField<number>;
    floorHeight: OfferField<number>;
    isBasementAvailable: OfferField<boolean>;
    sewageConnectionDetails: OfferField<string>; 
    burden: OfferField<string>,
    heatingType: OfferField<string>;
    windowsType: OfferField<string>;
    isMarketPrimary: boolean;
    acquisitionType: OfferField<string>;
    rooms: Room[];
    officeBuildingCategory: OfferField<string>;
    electricityConnectionDetails: OfferField<string>;
    buildingType: OfferField<string>;
    flatType: OfferField<string>;
    yearBuilt: OfferField<number>;
    isTerraceAvailable: OfferField<boolean>;
    flatSetUp: OfferField<string>;
    waterConnectionDetails: OfferField<string>; 
    roomsHeight: OfferField<number>;
    isParkingAvailable: OfferField<boolean>;
    isFenceAvailable: OfferField<boolean>;
    isElevatorAvailable: OfferField<boolean>;
    isAccessible: OfferField<boolean>;
    minimumRentingPeriodInMonths: OfferField<number>;
    isReceptionAvailable: OfferField<boolean>;
    isComputerNetworkAvailable: OfferField<boolean>;
    securityType: OfferField<string>;
    entrance: OfferField<string>;
    noiseLevel: OfferField<string>;
    constructionTechnology: OfferField<string>;
    // Fields related to halls:
    isFloorDustFree: OfferField<boolean>;
    isLoadingRampAvailable: OfferField<boolean>;
    warehouseArea: OfferField<number>;
    warehouseYardArea: OfferField<number>;
    isYardHardened: OfferField<boolean>;
    isManeuveringAreaAvailable: OfferField<boolean>;
    isTruckParkingAvailable: OfferField<boolean>;
    isGantryAvailable: OfferField<boolean>;
    isGoodsLiftAvailable: OfferField<boolean>;
    // Fields related to premises:
    premiseState: OfferField<string>;
    premiseType: OfferField<string>;
    premiseBackRoomArea: OfferField<number>;
    premiseSalesRoomArea: OfferField<number>;
    // Fields related to land lots:
    mpzp: OfferField<string>;
    mpzpInfo: OfferField<string>;
    landLotUse: OfferField<string>;
    landLotDetailedSize: OfferField<string>;
    landLotConstructionConditions: OfferField<string>;
    landLotForm: OfferField<string>;
    landLotFrontLineWidth: OfferField<number>;
    landLotShape: OfferField<string>;
    landLotLegalStatus: OfferField<string>;
    landLotFenceType: OfferField<string>;
    landLotBuildings: OfferField<string>;
}
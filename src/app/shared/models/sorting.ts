export interface Sorting {
    displayName: string;
    type: SortingType;
    propertyName: string;
    isAscending: boolean;
};

export enum SortingType {
    CreationDate,
    Price,
    PricePerSquareMeter,
    Area,
};

export const AVAILABLE_SORTINGS = [
    {
        displayName: 'dacie dodania',
        type: SortingType.CreationDate,
        propertyName: 'creationDate',
        isAscending: false,
    },
    {
        displayName: 'cenie rosnąco',
        type: SortingType.Price,
        propertyName: 'price',
        isAscending: true,
    },
    {
        displayName: 'cenie malejąco',
        type: SortingType.Price,
        propertyName: 'price',
        isAscending: false,
    },
    {
        displayName: 'cenie za m² rosnąco',
        type: SortingType.PricePerSquareMeter,
        propertyName: 'pricePerSquareMeter',
        isAscending: true,
    },
    {
        displayName: 'cenie za m² malejąco',
        type: SortingType.PricePerSquareMeter,
        propertyName: 'pricePerSquareMeter',
        isAscending: false,
    },
    {
        displayName: 'powierzchni rosnąco',
        type: SortingType.Area,
        propertyName: 'totalArea',
        isAscending: true,
    },
    {
        displayName: 'powierzchni malejąco',
        type: SortingType.Area,
        propertyName: 'totalArea',
        isAscending: false,
    },
];

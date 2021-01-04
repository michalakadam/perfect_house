export interface Sorting {
    displayName: string;
    propertyName: string;
    isAscending: boolean;
};

export const AVAILABLE_SORTINGS = [
    {
        displayName: 'dacie dodania',
        propertyName: 'creationDate',
        isAscending: false,
    },
    {
        displayName: 'cenie rosnąco',
        propertyName: 'price',
        isAscending: true,
    },
    {
        displayName: 'cenie malejąco',
        propertyName: 'price',
        isAscending: false,
    },
    {
        displayName: 'cenie za m² rosnąco',
        propertyName: 'pricePerSquareMeter',
        isAscending: true,
    },
    {
        displayName: 'cenie za m² malejąco',
        propertyName: 'pricePerSquareMeter',
        isAscending: false,
    },
    {
        displayName: 'powierzchni rosnąco',
        propertyName: 'totalArea',
        isAscending: true,
    },
    {
        displayName: 'powierzchni malejąco',
        propertyName: 'totalArea',
        isAscending: false,
    },
];

export interface Estate {
    displayName: string,
    queryName: string,
}

export const AVAILABLE_ESTATE_TYPES = [
    {
        displayName: 'wszystkie',
        queryName: '',
    },
    {
        displayName: 'mieszkania',
        queryName: 'Mieszkanie',
    },
    {
        displayName: 'domy',
        queryName: 'Dom',
    },
    {
        displayName: 'działki',
        queryName: 'Działka',
    },
    {
        displayName: 'lokale',
        queryName: 'Lokal',
    },
    {
        displayName: 'hale',
        queryName: 'Hala',
    },
    {
        displayName: 'obiekty',
        queryName: 'Obiekt',
    },
];
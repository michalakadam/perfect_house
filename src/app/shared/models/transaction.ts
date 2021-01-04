export interface Transaction {
    displayName: string;
    isForRent: boolean;
};

export const AVAILABLE_TRANSACTIONS = [
    {
        displayName: 'na sprzedaż',
        isForRent: false,
    },
    {
        displayName: 'na wynajem',
        isForRent: true,
    },
];
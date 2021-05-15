import { existsSync, readFileSync } from 'fs';
import { PartialOffer } from './models';

const OFFERS_FOLDER = '/home/adam/Documents/oferty/temp/';
const REMOVED_FILE_PATH = OFFERS_FOLDER + 'removed.json';
const MODIFIED_FILE_PATH = OFFERS_FOLDER + 'offers.json';
const REMOVED_PROPERTY_NAME = 'Usuniete';
const MODIFIED_PROPERTY_NAME = 'Oferty';

export const getRemovedOffers = (): PartialOffer[] => {
    return getOffers(REMOVED_FILE_PATH, REMOVED_PROPERTY_NAME);
}

export const getModifiedOffers = (): PartialOffer[] => {
    return getOffers(MODIFIED_FILE_PATH, MODIFIED_PROPERTY_NAME);
}

function getOffers(filePath: string, propertyName: string): PartialOffer[] {
    if (existsSync(filePath)) {
        const offers = getOffersFromFile(filePath, propertyName);

        if (offers) {
            return enforceArray(offers);
        }     
    }
    return [];
}

function getOffersFromFile(filePath: string, propertyName: string)  {
    return JSON.parse(readFileSync(filePath, 'utf-8'))[propertyName]?.['Oferta'];
}

// When converting xml to json single element is converted to object instead of array.
function enforceArray(offers: PartialOffer|PartialOffer[]): PartialOffer[] {
    return Array.isArray(offers) ? offers : [offers];
}

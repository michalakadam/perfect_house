import {existsSync, readFileSync} from 'fs';
import {RemovedOffer} from './models'

const OFFERS_FOLDER = '/home/adam/Documents/oferty/temp/';
const REMOVED_FILE_NAME = 'removed.json';
const REMOVED_FILE_PATH = OFFERS_FOLDER + REMOVED_FILE_NAME;

export const getRemovedOffersIds = (): string[] => {
    if (existsSync(REMOVED_FILE_PATH)) {
        let removedOffers = JSON.parse(readFileSync(REMOVED_FILE_PATH, 'utf-8'));
        if (removedOffers['Usuniete']?.['Oferta']?.length) {
            return removedOffers['Usuniete']['Oferta'].map((offer: RemovedOffer) => offer.ID);
        }     
    }
    return [];
}

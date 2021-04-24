import {existsSync, readFileSync} from 'fs';

const OFFERS_FOLDER = '/home/adam/Documents/oferty/temp/';
const REMOVED_FILE_NAME = 'removed.json';
const REMOVED_FILE_PATH = OFFERS_FOLDER + REMOVED_FILE_NAME;

export const getRemovedOffers = () => {
    if (existsSync(REMOVED_FILE_PATH)) {
        let removedOffers = JSON.parse(readFileSync(REMOVED_FILE_PATH, 'utf-8'));
        if (removedOffers['Usuniete'] && removedOffers['Usuniete']['Oferta']) {
            return removedOffers['Usuniete']['Oferta'];
        }     
    }
    return [];
}

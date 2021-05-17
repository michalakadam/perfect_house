import {getModifiedOffers, getRemovedOffers} from './file_reader.js';
// import types
import {MongoClient, MongoClientOptions, MongoError, Collection, FilterQuery} from 'mongodb';
//import functionality
import connect from 'mongodb';
const {MongoClient: Mongo} = connect;
import moment from 'moment';

import {PartialOffer} from './models/partial_offer.js';
import {log} from './logger.js';

const DB_URL = 'mongodb://127.0.0.1:27017';
const CONNECTION_CONFIG: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const DB_NAME = 'perfecthouse';
const OFFERS_COLLECTION_NAME = 'offers'

interface IdFilterQuery {
    ID: string;
}

Mongo.connect(DB_URL, CONNECTION_CONFIG, (err: MongoError, client: MongoClient) => {
    log('===== ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' =====');
    log('Established connection with the database.', err);
    const db = client.db(DB_NAME);
    const offersCollection = db.collection(OFFERS_COLLECTION_NAME);

    removeOffers(offersCollection);
    updateOffers(offersCollection);
});

function removeOffers(collection: Collection) {
    const removedOffers = getRemovedOffers();
    
    log(`Removing ${removedOffers.length} deleted offers.`);
    removeOffersFromDb(collection, removedOffers);
}

function updateOffers(collection: Collection) {
    const modifiedOffers = getModifiedOffers();

    log(`Removing ${modifiedOffers.length} modified offers.`);
    removeOffersFromDb(collection, modifiedOffers);
    // Db operations are asynchronous, removal needs to take place before adding.
    setTimeout(() => {
        log(`Adding ${modifiedOffers.length} modified offers.`);
        addOffersToDb(collection, modifiedOffers);
    }, 5000);
}

function removeOffersFromDb(collection: Collection, offers: PartialOffer[]) {
    if (offers?.length) {
        const filter: FilterQuery<IdFilterQuery> = {
            ID: {$in: getOffersIds(offers)},
        };

        collection.deleteMany(filter, (err, result) => {
            log(`${result.deletedCount} offers removed from the database with IDs: ${getOffersIds(offers)}.`, err);
        });
    }
}

function addOffersToDb(collection: Collection, offers: PartialOffer[]) {
    if (offers?.length) {
        collection.insertMany(offers, (err, result) => {
            log(`${result.insertedCount} offers added to the database with _ids: ${JSON.stringify(result.insertedIds)}`, err);
        });
    }   
}

function getOffersIds(offers: PartialOffer[]) {
    return offers.map((offer) => offer.ID);
}

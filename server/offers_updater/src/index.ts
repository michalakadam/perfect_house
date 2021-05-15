import {getModifiedOffers, getRemovedOffers} from './file_reader.js';
// import types
import {MongoClient, MongoClientOptions, MongoError, Collection, FilterQuery} from 'mongodb';
//import functionality
import connect from 'mongodb';
import {PartialOffer} from './models/partial_offer.js';
const {MongoClient: Mongo} = connect;

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
    catchError(err);
    const db = client.db(DB_NAME);
    const offersCollection = db.collection(OFFERS_COLLECTION_NAME);

    removeOffers(offersCollection);
    updateOffers(offersCollection);
});

function removeOffers(collection: Collection) {
    removeOffersFromDb(collection, getRemovedOffers())
}

function updateOffers(collection: Collection) {
    const modifiedOffers = getModifiedOffers();

    removeOffersFromDb(collection, modifiedOffers);
    // Db operations are asynchronous, removal needs to take place before adding.
    setTimeout(() => {
        addOffersToDb(collection, modifiedOffers);
    }, 5000);
}

function removeOffersFromDb(collection: Collection, offers: PartialOffer[]) {
    if (offers?.length) {
        const filter: FilterQuery<IdFilterQuery> = {
            ID: {$in: getOffersIds(offers)},
        };

        collection.deleteMany(filter, (err, result) => {
            catchError(err);
        });
    }
}

function addOffersToDb(collection: Collection, offers: PartialOffer[]) {
    if (offers?.length) {
        collection.insertMany(offers, (err, results) => {
            catchError(err);
        });
    }   
}

function getOffersIds(offers: PartialOffer[]) {
    return offers.map((offer) => offer.ID);
}

function catchError(err: MongoError) {
    if (err) {
        console.warn(err);
    }
}

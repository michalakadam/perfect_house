import {getRemovedOffersIds} from './file_reader.js';
// import types
import {MongoClient, MongoClientOptions, MongoError, Collection, FilterQuery} from 'mongodb';
//import functionality
import connect from 'mongodb';
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
});

function removeOffers(collection: Collection) {
    const removedOffersIds = getRemovedOffersIds();
    if (removedOffersIds?.length) {
        const filter: FilterQuery<IdFilterQuery> = {ID: {$in: removedOffersIds}};
        collection.deleteMany(filter, (err) => {
            catchError(err);
        });
    }
}

function catchError(err: MongoError) {
    if (err) {
        console.warn(err);
    }
}

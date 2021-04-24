import {getRemovedOffers} from './file_reader.js';
// import types
import {MongoClient, MongoClientOptions, MongoError} from 'mongodb';
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

Mongo.connect(DB_URL, CONNECTION_CONFIG, (err: MongoError, client: MongoClient) => {
    if (err) {
        console.warn(err);
    }
    const db = client.db(DB_NAME);
    const offersCollection = db.collection(OFFERS_COLLECTION_NAME);
});

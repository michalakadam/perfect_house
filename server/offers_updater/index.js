const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const fr = require('./file_reader');

const URL = 'mongodb://127.0.0.1:27017';
const CONNECTION_CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const DB_NAME = 'perfecthouse';

MongoClient.connect(URL, CONNECTION_CONFIG, (err, client) => {
    if (err) {
        console.warn(err);
    }
    const db = client.db(DB_NAME);
    const offersCollection = db.collection('offers');

    const removedOffers = fr.getRemovedOffers();
    if (removedOffers && removedOffers.length) {
        for (const offer of removedOffers) {
            offersCollection.deleteOne({_id: offer['ID']})
        }
    }
});

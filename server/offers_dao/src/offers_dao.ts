
import { MongoClient, MongoClientOptions, MongoError } from 'mongodb';
import { Observable, Subject } from 'rxjs';

const Mongo = require('mongodb').MongoClient;

const DB_URL = 'mongodb://127.0.0.1:27017';
const CONNECTION_CONFIG: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const DB_NAME = 'perfecthouse';
const OFFERS_COLLECTION_NAME = 'offers'

export class OffersDao {
	private offersList = new Subject<any[]>();

	constructor() {}

	listOffers(): Observable<any[]> {
		Mongo.connect(DB_URL, CONNECTION_CONFIG, (err: MongoError, client: MongoClient) => {
			const db = client.db(DB_NAME);
			const offersCollection = db.collection(OFFERS_COLLECTION_NAME);
			
			offersCollection.find().toArray((err: MongoError, offers) => {
				if (err) console.error(err);
				else this.offersList.next(offers);
				
				client.close();
			});
		});
		
		return this.offersList;
	}
}

import { OffersConverter } from './offers-converter';
import { OffersDao } from './offers_dao';
import { take } from 'rxjs/operators'

new OffersDao().listOffers().pipe(take(1)).subscribe((offers: any[]) => {
    console.log(`Received ${offers.length} offers!`);
    const convertedOffers = new OffersConverter().convertToReadableOffers(offers);
});
import { OffersConverter } from './offers-converter';
import { OffersDao } from './offers_dao';
import { take } from 'rxjs/operators';
import { Request, Response } from 'express';

const express = require('express');
const app = express();
const port = 3000;
const helmet = require('helmet');
const offersDao = new OffersDao();

app.get('/offers', (req: Request, res: Response) => {
    offersDao.listOffers().pipe(take(1)).subscribe((offers: any[]) => {
        res.json(new OffersConverter().convertToReadableOffers(offers));
    });
});

app.use((req: Request, res: Response) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

app.use(helmet());
app.listen(port, '51.77.195.170');

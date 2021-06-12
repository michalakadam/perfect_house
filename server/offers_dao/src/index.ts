import { OffersConverter } from "./offers-converter";
import { OffersDao } from "./offers_dao";
import { take } from "rxjs/operators";
import { Request, Response } from "express";

const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");

const PORT_NUMBER = 3000;
const offersDao = new OffersDao();
var corsOptions = {
  origin: ["https://perfect.stronazen.pl", "http://localhost:4200"],
};

app.use(helmet());
app.use(cors(corsOptions));

app.get("/offers", (req: Request, res: Response) => {
  offersDao
    .listOffers()
    .pipe(take(1))
    .subscribe((offers: any[]) => {
      res.json(new OffersConverter().convertToReadableOffers(offers));
    });
});

app.use((req: Request, res: Response) => {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
});

app.listen(PORT_NUMBER, "51.77.195.170");

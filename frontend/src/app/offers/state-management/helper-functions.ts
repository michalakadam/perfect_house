import { Offer } from "src/app/shared/models";

export const computeMainPageOffers = (offers: Offer[]) => {
  const shuffleOffers = (offers: Offer[]): Offer[] => {
    for (let i = offers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [offers[i], offers[j]] = [offers[j], offers[i]];
    }
    return offers;
  };

  return shuffleOffers(offers.filter((offer) => offer.isExclusive));
};

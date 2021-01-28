import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OffersDao } from '../services/offers-dao.service';
import { Offer } from '../shared/models';

@Component({
  selector: 'perfect-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent {
  offer: Offer;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private offersDao: OffersDao) {
    this.route.params.subscribe((params: Params) => {
        if (params.symbol) {
          this.loadOffer(params.symbol);
        } else  {
          this.router.navigate(['/strona-nie-istnieje']);
        }    
      });
  }

  private loadOffer(symbol: string) {
    if (this.consistsOnlyOfNumbers(symbol)) {
      this.reloadOfferUsingSymbol(Number(symbol));
    } else {
      this.offer = this.offersDao.getOfferBySymbol(symbol);
      if (this.offer) {
        console.log(this.offer);
        this.titleService.setTitle(this.offer.title);
      } else {
        this.router.navigate(['/strona-nie-istnieje']);
      }
    }
  }

  private consistsOnlyOfNumbers(symbol: string) {
    return /^\d+$/.test(symbol);
  }

  private reloadOfferUsingSymbol(offerNumber: number) {
      const symbol = this.offersDao.getOfferByNumber(offerNumber)?.symbol;
      if (symbol) {
        this.router.navigate(['oferta', symbol]);
      } else {
        this.router.navigate(['/strona-nie-istnieje']);
      }
  }
}

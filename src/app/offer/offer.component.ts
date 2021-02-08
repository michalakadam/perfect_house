import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OffersDao } from '../services/offers-dao.service';
import { SnackbarService } from '../services/snackbar.service';
import { Offer } from '../shared/models';

@Component({
  selector: 'perfect-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent implements OnDestroy {
  private subscription: Subscription;
  offer: Offer;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private offersDao: OffersDao,
    private snackbarService: SnackbarService) {
    this.subscription = this.route.params.subscribe((params: Params) => {
        if (params.symbol) {
          this.loadOffer(params.symbol);
        } else  {
          this.handleNonexistentOffer();
        }    
      });
  }

  private loadOffer(symbol: string) {
    if (this.consistsOnlyOfNumbers(symbol)) {
      this.reloadOfferUsingSymbol(Number(symbol));
    } else {
      this.offer = this.offersDao.getOfferBySymbol(symbol);
      if (this.offer) {
        this.titleService.setTitle(this.offer.title);
      } else {
        this.handleNonexistentOffer(symbol);
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
      this.handleNonexistentOffer(offerNumber + '');
    }
  }
  
  handleNonexistentOffer(symbol = '') {
    setTimeout(() => {
      this.snackbarService.open(`Oferta ${symbol} nie istnieje.`);
    }, 500)
    this.router.navigate(['/oferty']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

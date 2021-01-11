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
        this.offer = this.offersDao.getOfferBySymbol(params.symbol);
        this.titleService.setTitle(this.offer.title);
        console.log(this.offer)
        } else if (!params.symbol || !this.offer) {
          this.router.navigate(['/strona-nie-istnieje']);
        }    
      });
  }
}

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OffersDao } from '../services/offers-dao.service';
import { Offer } from '../shared/models';
import { AgentsDao } from 'src/app/services/agents-dao.service';
import { Agent } from 'src/app/shared/models';

const IMAGES = [
  // {
  //   "previewImageSrc": "src/offers/ofe_2554254.jpg",
  //   "thumbnailImageSrc":"src/offers/ofe_2554254.jpg",
  //   "title": "Zdjęcie oferty"
  // },
  // { 
  //   "previewImageSrc": "src/offers/ofe_2554258.jpg",
  //   "thumbnailImageSrc":"src/offers/ofe_2554258.jpg",
  //   "title": "Zdjęcie oferty"
  // },
  {
    "previewImageSrc": "/assets/dla_ciebie.jpg",
    "thumbnailImageSrc": "/assets/dla_ciebie.jpg",
    "title": "Sprawdź nasze oferty dla Ciebie."
  },
  {
    "previewImageSrc": "/assets/nad_morzem.jpg",
    "thumbnailImageSrc": "/assets/nad_morzem.jpg",
    "title": "Zobacz inwestycje nad morzem."
  },
  {
    "previewImageSrc": "/assets/po_poznansku.jpg",
    "thumbnailImageSrc": "/assets/po_poznansku.jpg",
    "title": "Sprawdź nasze oferty dla Ciebie."
  },
]

@Component({
  selector: 'perfect-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent {
  
  offer: Offer;
  agent: Agent;
  images = IMAGES;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private offersDao: OffersDao,
    readonly agentsDao: AgentsDao){
    this.route.params.subscribe((params: Params) => {
        if (params.symbol) {
          this.loadOffer(params.symbol);
        } else  {
          this.router.navigate(['/strona-nie-istnieje']);
        }    
      });
      this.agent = this.agentsDao.getAgentById(this.offer.id);
  }

  private loadOffer(symbol: string) {
    if (this.consistsOnlyOfNumbers(symbol)) {
      this.reloadOfferUsingSymbol(Number(symbol));
    } else {
      this.offer = this.offersDao.getOfferBySymbol(symbol);
      if (this.offer) {
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

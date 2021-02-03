import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OffersDao } from '../services/offers-dao.service';
import { Offer, GalleryPhoto } from '../shared/models';
import { AgentsDao } from 'src/app/services/agents-dao.service';
import { Agent } from 'src/app/shared/models';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'perfect-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent {
  offer: Offer;
  images: GalleryPhoto[] = [];
  constructor(private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private titleService: Title,
    private offersDao: OffersDao,
    readonly agentsDao: AgentsDao,
    private snackbarService: SnackbarService) {
    this.route.params.subscribe((params: Params) => {
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
        this.images = this.computeImages(this.offer.photos);
        this.changeDetector.detectChanges();
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
  navigateToAgentPage(agent: Agent) {
    this.router.navigate(['/ludzie/' + this.computeAgentLink(agent.fullName)]);
  }

  computeAgentLink(agentFullName: string): string {
    return agentFullName.toLowerCase().split(' ').join('-');
  }
  
  computeImages(photos: string[]): GalleryPhoto[] {
    let computedPhotos: GalleryPhoto[] = [];
    for (let photo of photos) {
      computedPhotos.push({ 
        previewImageSrc: '/offers/' + photo,
        thumbnailImageSrc: '/offers/' + photo,
      })
    }
    return computedPhotos
    
  }
}

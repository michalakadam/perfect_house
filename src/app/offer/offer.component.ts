import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OffersDao } from '../shared/services/offers-dao.service';
import { Offer, OfferField } from '../shared/models';
import { AgentsDao } from 'src/app/shared/services/agents-dao.service';
import { Agent } from 'src/app/shared/models';
import { SnackbarService } from '../shared/services/snackbar.service';
import { WindowSizeDetector } from '../shared/services/window-size-detector.service'

@Component({
  selector: 'perfect-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  offer: Offer;
  definedOfferFields: OfferField<any>[] = [];

  constructor(private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private titleService: Title,
    private offersDao: OffersDao,
    readonly agentsDao: AgentsDao,
    readonly windowSizeDetector: WindowSizeDetector,
    private snackbarService: SnackbarService) {
      this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
        this.changeDetector.detectChanges();
      });
    }

  ngOnInit() {
    this.subscription.add(this.route.params.subscribe((params: Params) => {
        if (params.symbol) {
          this.loadOffer(params.symbol);
        } else  {
          this.handleNonexistentOffer();
        }    
      }));
  }

  private loadOffer(symbol: string) {
    if (this.consistsOnlyOfNumbers(symbol)) {
      this.reloadOfferUsingSymbol(Number(symbol));
    } else {
      this.offer = this.offersDao.getOfferBySymbol(symbol);
      if (this.offer) {
        this.titleService.setTitle(this.offer.title);
        this.definedOfferFields = this.computeDefinedOfferFields();
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
  
  private handleNonexistentOffer(symbol = '') {
    setTimeout(() => {
      this.snackbarService.open(`Oferta ${symbol} nie istnieje.`);
    }, 500)
    this.router.navigate(['/oferty']);
  }

  private computeDefinedOfferFields(): OfferField<any>[] {
    return Object.values(this.offer).filter(value => this.isDefinedOfferField(value)); 
  }

  private isDefinedOfferField(value: any): boolean {
    return this.isOfferField(value) && this.isDefined(value.value);
  }

  // Because of https://stackoverflow.com/a/46703380/11212568 instanceof
  // does not work on interface.
  private isOfferField(value: any): boolean {
    return value.hasOwnProperty('displayName') && value.hasOwnProperty('value');
  }

  private isDefined(value: any): boolean {
    if (typeof value === 'number') {
    return value > -1;
    }
    return !!value;  
  }

  navigateToAgentPage(agent: Agent) {
    this.router.navigate(['/ludzie/' + this.computeAgentLink(agent.fullName)]);
  }

  computeAgentLink(agentFullName: string): string {
    return agentFullName.toLowerCase().split(' ').join('-');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

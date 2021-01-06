import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AgentsDao } from 'src/app/services/agents-dao.service';
import { Offer } from 'src/app/shared/models';

@Component({
  selector: 'perfect-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferCardComponent {
  @Input() offer: Offer;

  constructor(readonly agentsDao: AgentsDao) {}
}

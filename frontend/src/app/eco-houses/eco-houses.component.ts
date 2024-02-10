import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgentsStateManager } from '../agents/state-management/state-manager.service';
import { WindowSizeDetector } from '../shared/services/window-size-detector.service';

const AGENT_RESPONSIBLE_FOR_MANAGEMENT_ID = 1155;

const PHOTO_URL_PREFIX = '/assets/';
const convertPhotoNameToUrl = (name: string): string => PHOTO_URL_PREFIX + name;

const HOUSES_PHOTO_NAMES = [
  'Carini_front.jpg',
  'Alcamo_Night.jpg',
  'Barierr.jpg',
  'Carini_garden.jpg',
];

@Component({
  selector: 'perfect-eco-houses',
  templateUrl: './eco-houses.component.html',
  styleUrls: ['./eco-houses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoHousesComponent implements OnDestroy {
  private subscription: Subscription;
  agentResponsibleForEcoHousesId = AGENT_RESPONSIBLE_FOR_MANAGEMENT_ID;
  housesPhotoUrls = HOUSES_PHOTO_NAMES.map(convertPhotoNameToUrl);

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    readonly agentsStateManager: AgentsStateManager,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(
      () => {
        this.changeDetector.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

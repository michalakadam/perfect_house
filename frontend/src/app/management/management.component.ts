import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AgentsDao } from '../shared/services/agents-dao.service';
import { WindowSizeDetector } from '../shared/services/window-size-detector.service';
import { Agent } from 'src/app/shared/models';
4;

const AGENT_RESPONSIBLE_ID = 20202;

/** Kontener strony 'Zarządzanie nieruchomościami'. */
@Component({
  selector: 'perfect-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementComponent implements OnDestroy {
  private subscription: Subscription;
  agentResponsibleForManagement: Agent;

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    readonly agentsDao: AgentsDao,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(
      () => {
        this.changeDetector.detectChanges();
      }
    );

    this.agentResponsibleForManagement =
      this.agentsDao.getAgentById(AGENT_RESPONSIBLE_ID);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

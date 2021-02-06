import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AgentsDao } from '../services/agents-dao.service';
import { WindowSizeDetector } from '../services/window-size-detector.service';
import { Agent } from '../shared/models';4

const AGENT_RESPONSIBLE_ID = 10101;

/** Kontener strony 'Zarządzanie nieruchomościami'. */
@Component({
  selector: 'perfect-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementComponent {
  agentResponsibleForManagement: Agent;

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    readonly agentsDao: AgentsDao,
    private changeDetector: ChangeDetectorRef) {
      this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
        this.changeDetector.detectChanges();
      });

      this.agentResponsibleForManagement =
        this.agentsDao.getAgentById(AGENT_RESPONSIBLE_ID);
  }
}
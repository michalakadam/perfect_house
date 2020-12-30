import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AgentsService } from '../services/agents.service';
import { WindowSizeDetector } from '../services/window-size-detector.service';
import { Agent } from '../shared/models/agent';4

const AGENT_RESPONSIBLE_SURNAME = 'Janicka';

/** Kontener strony 'Zarządzanie najmem'. */
@Component({
  selector: 'perfect-rental-management',
  templateUrl: './rental-management.component.html',
  styleUrls: ['./rental-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RentalManagementComponent {
  agentResponsibleForRentalManagement: Agent;

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    readonly agentsService: AgentsService,
    private changeDetector: ChangeDetectorRef) {
      this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
        this.changeDetector.detectChanges();
      });

      this.agentResponsibleForRentalManagement = this.agentsService.listAgents()
        .filter(agent => agent.surname === AGENT_RESPONSIBLE_SURNAME)[0];
  }
}
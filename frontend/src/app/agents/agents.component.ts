import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Agent } from 'src/app/shared/models';
import { AgentsStateManager } from './state-management/state-manager.service';

/** Wyświetla matrycę agentów. */
@Component({
  selector: 'perfect-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentsComponent {
  constructor(readonly agentsStateManager: AgentsStateManager) {}

  trackById(index: number, agent: Agent) {
    return agent.id;
  }
}

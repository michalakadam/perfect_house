import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgentsDao } from 'src/app/shared/services/agents-dao.service';
import { Agent } from '../shared/models';

/** Wyświetla matrycę agentów. */
@Component({
  selector: 'perfect-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentsComponent {

  constructor(readonly agentsDao: AgentsDao, private readonly router: Router) {}

  navigateToAgentPage(agent: Agent) {
    this.router.navigate(['/ludzie/' + this.computeAgentLink(agent.fullName)]);
  }

  computeAgentLink(agentFullName: string): string {
    return agentFullName.toLowerCase().split(' ').join('-');
  }

  trackById(index: number, agent: Agent) {
    return agent.id;
  }
}

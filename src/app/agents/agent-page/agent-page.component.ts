import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AgentsDao } from 'src/app/services/agents-dao.service';
import { Agent } from 'src/app/shared/models';

@Component({
  selector: 'perfect-agent-page',
  templateUrl: './agent-page.component.html',
  styleUrls: ['./agent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentPageComponent {
  agent: Agent;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private agentsDao: AgentsDao) {
    this.route.params.subscribe((params: Params) => {
        if (params.agent) {
          this.agent = this.agentsDao.getAgentByFullName(
            params.agent.split('-').join(' '));
          if (this.agent) {
            this.titleService.setTitle(this.agent.fullName);
          } else {
            this.router.navigate(['/strona-nie-istnieje']);
          }
        } else {
          this.router.navigate(['/strona-nie-istnieje']);
        }    
      });
  }
}

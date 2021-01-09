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
        const fullName = this.computeAgentFullName(params.agent);
        if (fullName) {
        this.titleService.setTitle(fullName);
        this.agent = this.agentsDao.getAgentByFullName(fullName);
        } else {
          this.router.navigate(['/strona-nie-istnieje']);
        }    
      });
  }

  private computeAgentFullName(fullName: string) {
    return this.capitalize(fullName.split('-').join(' '));
  }

  private capitalize(fullName) {
    return fullName.replace(/(^|\s)\S/g, letter => letter.toUpperCase());
  }
}

import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgentsDao } from 'src/app/shared/services/agents-dao.service';
import { Agent } from 'src/app/shared/models';

@Component({
  selector: 'perfect-agent-page',
  templateUrl: './agent-page.component.html',
  styleUrls: ['./agent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentPageComponent implements OnDestroy {
  private subscription: Subscription;

  agent: Agent;

  constructor(private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly agentsDao: AgentsDao) {
    this.subscription = this.route.params.subscribe((params: Params) => {
      if (params.agent) {
        const fullName = params.agent.includes('ilek-nowak') ?
          'Magdalena Ilek-Nowak' : params.agent.split('-').join(' ');
        this.agent = this.agentsDao.getAgentByFullName(fullName);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

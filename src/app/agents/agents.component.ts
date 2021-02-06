import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgentsDao } from 'src/app/services/agents-dao.service';
import { WindowSizeDetector } from '../services/window-size-detector.service';
import { Agent } from '../shared/models';

/** Wyświetla matrycę agentów. */
@Component({
  selector: 'perfect-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentsComponent implements OnDestroy {
  private subscription: Subscription;

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    readonly agentsDao: AgentsDao,
    private changeDetector: ChangeDetectorRef,
    private router: Router) {
      this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
        this.changeDetector.detectChanges();
      });
  }

  navigateToAgentPage(agent: Agent) {
    this.router.navigate(['/ludzie/' + this.computeAgentLink(agent.fullName)]);
  }

  computeAgentLink(agentFullName: string): string {
    return agentFullName.toLowerCase().split(' ').join('-');
  }

  trackById(index: number, agent: Agent) {
    return agent.id;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

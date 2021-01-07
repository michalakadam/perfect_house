import { Component, ChangeDetectionStrategy } from '@angular/core';

/** Wyświetla matrycę agentów. */
@Component({
  selector: 'perfect-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentsComponent {}

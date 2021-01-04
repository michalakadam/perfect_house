import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Agent } from '../models';

/** Awatar pracownika. Zawiera zdjęcie, imię i nazwisko oraz tytuł zawodowy. */
@Component({
  selector: 'perfect-agent-brief',
  templateUrl: './agent-brief.component.html',
  styleUrls: ['./agent-brief.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentBriefComponent {
  @Input() agent: Agent;
}

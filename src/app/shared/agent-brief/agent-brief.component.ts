import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

/** Awatar pracownika. Zawiera zdjęcie, imię i nazwisko oraz tytuł zawodowy. */
@Component({
  selector: 'perfect-agent-brief',
  templateUrl: './agent-brief.component.html',
  styleUrls: ['./agent-brief.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentBriefComponent {
  @Input() photo = "";
  @Input() name = "";
  @Input() surname = "";
  @Input() position = "";
  @Input() mail = "";
  @Input() mobile = "";
  @Input() licenseNumber = "";
}

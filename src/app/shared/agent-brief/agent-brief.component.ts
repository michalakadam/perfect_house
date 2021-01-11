import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { WindowSizeDetector } from 'src/app/services/window-size-detector.service';
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
  @Input() isContactInfoVisible = false;
  @Input() isVertical = false;
  @Input() displayBigger = false;

  constructor(readonly windowSizeDetector: WindowSizeDetector,
    readonly changeDetector: ChangeDetectorRef) {
      this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
        this.changeDetector.detectChanges();
      });
    }
}

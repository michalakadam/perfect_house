import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { Subscription } from "rxjs";
import { WindowSizeDetector } from "src/app/shared/services/window-size-detector.service";
import { AgentsStateManager } from "../state-management/state-manager.service";

@Component({
  selector: "perfect-agent-page",
  templateUrl: "./agent-page.component.html",
  styleUrls: ["./agent-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentPageComponent implements OnDestroy {
  private subscription: Subscription;

  constructor(
    readonly agentsStateManager: AgentsStateManager,
    readonly windowSizeDetector: WindowSizeDetector,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(
      () => {
        this.changeDetector.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

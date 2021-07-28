import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { Subscription } from "rxjs";
import { WindowSizeDetector } from "../shared/services/window-size-detector.service";
import { AgentsStateManager } from "../agents/state-management/state-manager.service";
4;

const AGENT_RESPONSIBLE_FOR_MANAGEMENT_ID = 20202;

/** Kontener strony 'Zarządzanie nieruchomościami'. */
@Component({
  selector: "perfect-management",
  templateUrl: "./management.component.html",
  styleUrls: ["./management.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementComponent implements OnDestroy {
  private subscription: Subscription;
  agentResponsibleForManagementId = AGENT_RESPONSIBLE_FOR_MANAGEMENT_ID;

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    readonly agentsStateManager: AgentsStateManager,
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

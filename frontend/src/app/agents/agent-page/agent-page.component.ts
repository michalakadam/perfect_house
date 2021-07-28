import { Component, ChangeDetectionStrategy } from "@angular/core";
import { AgentsStateManager } from "../state-management/state-manager.service";

@Component({
  selector: "perfect-agent-page",
  templateUrl: "./agent-page.component.html",
  styleUrls: ["./agent-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentPageComponent {
  constructor(readonly agentsStateManager: AgentsStateManager) {}
}

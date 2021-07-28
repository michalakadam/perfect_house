import { Injectable } from "@angular/core";

import * as rawAgents from "src/agents/agents.json";
import { Agent } from "../../shared/models";
import { AgentsConverter } from "./agents-converter.service";
import { Observable, ReplaySubject } from "rxjs";

const CEO_ID = "1155";

const MAGDA_PROFILE_FOR_MANAGEMENT_ID = "20202";

@Injectable({
  providedIn: "root",
})
export class AgentsDao {
  private readonly agents = new ReplaySubject<Agent[]>(1);

  constructor(private readonly agentsConverter: AgentsConverter) {
    this.agents.next(
      this.agentsConverter
        .convertToReadableAgents(rawAgents.Agenci.Agent)
        .filter((agent) => agent.id !== MAGDA_PROFILE_FOR_MANAGEMENT_ID)
        .sort((a, b) => this.sortAgents(a, b))
    );
  }

  listAgents(): Observable<Agent[]> {
    return this.agents;
  }

  private sortAgents(a: Agent, b: Agent): number {
    if (a.id === CEO_ID) {
      return -1;
    }
    if (b.id === CEO_ID) {
      return 1;
    }
    return this.extractSurname(a.fullName) < this.extractSurname(b.fullName)
      ? -1
      : this.extractSurname(a.fullName) > this.extractSurname(b.fullName)
      ? 1
      : 0;
  }

  private extractSurname(fullName: string): string {
    return fullName.split(" ")[1];
  }
}

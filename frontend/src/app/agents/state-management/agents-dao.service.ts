import { Injectable } from "@angular/core";

import { Agent } from "../../shared/models";
import { AgentsConverter } from "./agents-converter.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

const CEO_ID = "1155";

@Injectable({
  providedIn: "root",
})
export class AgentsDao {
  private agents: Observable<Agent[]>;

  constructor(private httpClient: HttpClient, private readonly agentsConverter: AgentsConverter) {
    // Not reading agents.json directly from filesystem to prevent caching issues.
    this.agents = this.httpClient.get("agents/agents.json").pipe(
      map((rawAgents: any[]) => this.agentsConverter
        .convertToReadableAgents(rawAgents)
        .sort((a, b) => this.sortAgents(a, b))
      )
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

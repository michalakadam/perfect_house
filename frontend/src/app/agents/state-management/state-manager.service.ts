import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Agent } from "src/app/shared/models";
import { listAgents } from "./actions";
import * as selectors from "./selectors";

@Injectable({
  providedIn: "root",
})
export class AgentsStateManager {
  constructor(private store: Store) {
    this.store.dispatch(listAgents());
  }

  agents$: Observable<Agent[]> = this.store.select(selectors.getAgents);

  currentAgent$: Observable<Agent> = this.store.select(
    selectors.getCurrentAgent
  );

  agentById$(id: number): Observable<Agent> {
    return this.store.select(selectors.getAgentById(id));
  }
}

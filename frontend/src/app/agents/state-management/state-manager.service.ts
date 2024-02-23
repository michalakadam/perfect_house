import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { openAgentPage } from 'src/app/router/state-management/actions';
import { Agent } from 'src/app/shared/models';
import { listAgents, loadNextAgent, loadPreviousAgent } from './actions';
import * as selectors from './selectors';

@Injectable({
  providedIn: 'root',
})
export class AgentsStateManager {
  constructor(private store: Store) {
    this.store.dispatch(listAgents());
  }

  get agents$(): Observable<Agent[]> {
    return this.store.select(selectors.getUniqueAgents);
  }

  get currentAgent$(): Observable<Agent> {
    return this.store.select(selectors.getCurrentAgent);
  }

  get isPreviousAgentAvailable$(): Observable<boolean> {
    return this.store.select(selectors.getIsPreviousAgentAvailable);
  }

  get isNextAgentAvailable$(): Observable<boolean> {
    return this.store.select(selectors.getIsNextAgentAvailable);
  }

  agentById$(id: number): Observable<Agent> {
    return this.store.select(selectors.getAgentById(id));
  }

  openAgentPage(agentFullName: string) {
    this.store.dispatch(openAgentPage({ agentFullName }));
  }

  loadPreviousAgent() {
    this.store.dispatch(loadPreviousAgent());
  }

  loadNextAgent() {
    this.store.dispatch(loadNextAgent());
  }
}

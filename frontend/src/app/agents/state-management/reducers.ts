import { Action, createReducer, on } from '@ngrx/store';
import { Agent } from 'src/app/shared/models';
import { listAgents, listAgentsSuccess, loadCurrentAgent } from './actions';

export const stateKey = 'agents';

export interface AgentsState {
  isLoading: boolean;
  agents: Agent[];
  currentAgent: Agent;
}

const initialState: AgentsState = {
  isLoading: true,
  agents: [],
  currentAgent: null,
};

const agentsReducer = createReducer(
  initialState,
  on(listAgents, (state) => ({
    ...state,
    ...initialState,
  })),
  on(listAgentsSuccess, (state, { agents }) => ({
    ...state,
    agents,
    isLoading: false,
  })),
  on(loadCurrentAgent, (state, { agent }) => ({
    ...state,
    currentAgent: agent,
  })),
);

export function reducer(state: AgentsState | undefined, action: Action) {
  return agentsReducer(state, action);
}

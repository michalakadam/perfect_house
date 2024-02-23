import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Agent } from 'src/app/shared/models';
import { AgentsState, stateKey } from './reducers';

const MAGDA_PROFILE_FOR_MANAGEMENT_ID = '20202';

const selectAgentsState = createFeatureSelector<AgentsState>(stateKey);

export const getIsLoading = createSelector(
  selectAgentsState,
  (state: AgentsState) => state.isLoading,
);

export const getAllAgents = createSelector(
  selectAgentsState,
  (state: AgentsState) => state.agents,
);

export const getUniqueAgents = createSelector(
  selectAgentsState,
  (state: AgentsState) =>
    state.agents.filter(
      (agent) => agent.id !== MAGDA_PROFILE_FOR_MANAGEMENT_ID,
    ),
);

export const getCurrentAgent = createSelector(
  selectAgentsState,
  (state: AgentsState) => state.currentAgent,
);

export const getAgentById = (id: number) =>
  createSelector(getAllAgents, (agents: Agent[]) => {
    return agents.find((agent) => agent.id === '' + id);
  });

export const getCurrentAgentIndex = createSelector(
  getUniqueAgents,
  getCurrentAgent,
  (agents: Agent[], currentAgent: Agent) => {
    if (currentAgent) {
      return agents.map((agent) => agent.id).indexOf(currentAgent.id);
    }
    return -1;
  },
);

export const getIsPreviousAgentAvailable = createSelector(
  getCurrentAgentIndex,
  (index: number) => {
    return index > 0;
  },
);

export const getIsNextAgentAvailable = createSelector(
  getUniqueAgents,
  getCurrentAgentIndex,
  (agents: Agent[], index: number) => {
    return index < agents.length - 1;
  },
);

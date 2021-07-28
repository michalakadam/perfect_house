import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Agent } from "src/app/shared/models";
import { AgentsState, stateKey } from "./reducers";

const selectAgentsState = createFeatureSelector<AgentsState>(stateKey);

export const getIsLoading = createSelector(
  selectAgentsState,
  (state: AgentsState) => state.isLoading
);

export const getAgents = createSelector(
  selectAgentsState,
  (state: AgentsState) => state.agents
);

export const getCurrentAgent = createSelector(
  selectAgentsState,
  (state: AgentsState) => state.currentAgent
);

export const getAgentById = (id: number) =>
  createSelector(getAgents, (agents: Agent[]) => {
    return agents.find((agent) => agent.id === "" + id);
  });

export const getCurrentAgentIndex = createSelector(
  getAgents,
  getCurrentAgent,
  (agents: Agent[], currentAgent: Agent) => {
    if (currentAgent) {
      return agents.map((agent) => agent.id).indexOf(currentAgent.id);
    }
    return -1;
  }
);

export const getIsPreviousAgentAvailable = createSelector(
  getCurrentAgentIndex,
  (index: number) => {
    return index > 0;
  }
);

export const getIsNextAgentAvailable = createSelector(
  getAgents,
  getCurrentAgentIndex,
  (agents: Agent[], index: number) => {
    return index < agents.length - 1;
  }
);

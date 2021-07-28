import { createAction, props } from "@ngrx/store";
import { Agent } from "src/app/shared/models";

// Actions' identifiers.
export const LIST_AGENTS = "[Agents] List";
export const LIST_AGENTS_SUCCESS = "[Agents] List Success";
export const LOAD_CURRENT_AGENT = "[Agents] Load current agent";
export const LOAD_PREVIOUS_AGENT = "[Agents] Load previous agent";
export const LOAD_NEXT_AGENT = "[Agents] Load next agent";

// Actions' definitions.
export const listAgents = createAction(LIST_AGENTS);
export const listAgentsSuccess = createAction(
  LIST_AGENTS_SUCCESS,
  props<{ agents: Agent[] }>()
);
export const loadCurrentAgent = createAction(
  LOAD_CURRENT_AGENT,
  props<{ agent: Agent }>()
);
export const loadPreviousAgent = createAction(LOAD_PREVIOUS_AGENT);
export const loadNextAgent = createAction(LOAD_NEXT_AGENT);

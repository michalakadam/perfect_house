import { createAction, props } from "@ngrx/store";
import { Agent } from "src/app/shared/models";

// Actions' identifiers.
export const LIST_AGENTS = "[Agents] List";
export const LIST_AGENTS_SUCCESS = "[Agents] List Success";
export const LOAD_CURRENT_AGENT = "[Agents] Load current agent";

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

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, first, withLatestFrom, debounce } from 'rxjs/operators';
import {
  listAgentsSuccess,
  LIST_AGENTS,
  loadCurrentAgent,
  LOAD_NEXT_AGENT,
  LOAD_PREVIOUS_AGENT,
} from './actions';
import { AgentsDao } from './agents-dao.service';
import * as agentsSelectors from './selectors';
import * as routerSelectors from 'src/app/router/state-management/selectors';
import { Agent } from 'src/app/shared/models';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { Params } from '@angular/router';
import {
  AGENT_PAGE_NAVIGATED,
  openAgentPage,
  pageNotFound,
} from 'src/app/router/state-management/actions';
import { Action } from '@ngrx/store';
import { timer } from 'rxjs';

@Injectable()
export class AgentsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly agentsDao: AgentsDao,
    private readonly store: Store,
    private readonly titleService: Title,
  ) {}

  loadAgents = createEffect(() =>
    this.actions$.pipe(
      ofType(LIST_AGENTS),
      mergeMap(() =>
        this.agentsDao.listAgents().pipe(
          first((agents) => !!agents?.length),
          map((agents) => listAgentsSuccess({ agents })),
        ),
      ),
    ),
  );

  loadAgentForAgentPageFromUrl = createEffect(() =>
    this.actions$.pipe(
      ofType(AGENT_PAGE_NAVIGATED),
      withLatestFrom(this.store.select(agentsSelectors.getIsLoading)),
      // Agents list is not available when agent page is open directly.
      debounce(([action, isLoading]: [Action, boolean]) =>
        isLoading ? timer(2000) : timer(0),
      ),
      withLatestFrom(
        this.store.select(routerSelectors.getParams),
        this.store.select(agentsSelectors.getUniqueAgents),
        (
          [action, isLoading]: [Action, boolean],
          params: Params,
          agents: Agent[],
        ) => ({
          params,
          agents,
        }),
      ),
      map(({ params, agents }) => {
        if (params.agent) {
          const agent = getAgentByFullName(
            agents,
            convertUrlParamToAgentFullName(params.agent),
          );
          if (agent) {
            this.titleService.setTitle(agent.fullName);
            return loadCurrentAgent({ agent });
          }
        }
        return pageNotFound();
      }),
    ),
  );

  loadPreviousAgent = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_PREVIOUS_AGENT),
      withLatestFrom(
        this.store.select(agentsSelectors.getUniqueAgents),
        this.store.select(agentsSelectors.getCurrentAgentIndex),
        (action: Action, agents: Agent[], currentAgentIndex: number) => ({
          agents,
          currentAgentIndex,
        }),
      ),
      map(({ agents, currentAgentIndex }) =>
        openAgentPage({ agentFullName: agents[--currentAgentIndex].fullName }),
      ),
    ),
  );

  loadNextAgent = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_NEXT_AGENT),
      withLatestFrom(
        this.store.select(agentsSelectors.getUniqueAgents),
        this.store.select(agentsSelectors.getCurrentAgentIndex),
        (action: Action, agents: Agent[], currentAgentIndex: number) => ({
          agents,
          currentAgentIndex,
        }),
      ),
      map(({ agents, currentAgentIndex }) =>
        openAgentPage({ agentFullName: agents[++currentAgentIndex].fullName }),
      ),
    ),
  );
}

const convertUrlParamToAgentFullName = (fullName: string) => {
  return fullName.includes('ilek-nowak')
    ? 'Magdalena Ilek-Nowak'
    : fullName.split('-').join(' ');
};

const getAgentByFullName = (agents: Agent[], fullName: string) => {
  return agents.find(
    (agent) => agent.fullName.toLowerCase() === fullName.toLowerCase(),
  );
};

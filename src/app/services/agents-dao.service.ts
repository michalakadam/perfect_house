import { Injectable } from '@angular/core';

import * as rawAgents from "src/agents/agents.json";
import { Agent } from '../shared/models';
import { AgentsConverter } from './agents-converter.service';

@Injectable({
    providedIn: 'root',
})
export class AgentsDao {
    private agents: Agent[];

    constructor(private agentsConverter: AgentsConverter) {
        this.agents = this.agentsConverter.convertToReadableAgents(rawAgents.Agenci.Agent);
    }

    listAgents(): Agent[] {
        return this.agents;
    }

    getAgentByFullName(fullName: string): Agent {
        return this.agents.find(agent => agent.fullName === fullName);
    }
}

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
        return this.agents
        .sort(function(a, b){
            if(a.fullName.split(/\s+/).pop() < b.fullName.split(/\s+/).pop()) { return -1; }
            if(a.fullName.split(/\s+/).pop() > b.fullName.split(/\s+/).pop()) { return 1; }
            return 0;
        })
    }

    getAgentById(id: number): Agent {
        return this.agents.find(agent => agent.id === '' + id);
    }

    getAgentByFullName(fullName: string): Agent {
        return this.agents.find(agent => agent.fullName === fullName);
    }
}

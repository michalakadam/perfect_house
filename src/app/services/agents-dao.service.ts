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
          .sort((a, b) => {
            if (this.extractFirstLetter(a.fullName) < this.extractFirstLetter(b.fullName)) {
              return -1;
            }
            if (this.extractFirstLetter(a.fullName) > this.extractFirstLetter(b.fullName)) {
              return 1;
            }
            return 0;
          });
      }
      
      private extractFirstLetter(fullName: string): string {
        return fullName.split(/\s+/).pop();
      }

    getAgentById(id: number): Agent {
        return this.agents.find(agent => agent.id === '' + id);
    }

    getAgentByFullName(fullName: string): Agent {
        return this.agents.find(
            agent => agent.fullName.toLowerCase() === fullName.toLowerCase());
    }
}

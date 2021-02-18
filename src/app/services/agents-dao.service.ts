import { Injectable } from '@angular/core';

import * as rawAgents from "src/agents/agents.json";
import { Agent } from '../shared/models';
import { AgentsConverter } from './agents-converter.service';

const CEO_ID = '1155';

const MAGDA_PROFILE_FOR_MANAGEMENT_ID = '20202';

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
          .filter(agent => agent.id !== MAGDA_PROFILE_FOR_MANAGEMENT_ID)
          .sort((a, b) => this.sortAgents(a, b));
      }

    private sortAgents(a: Agent, b: Agent): number {
      if (a.id === CEO_ID) {
        return -1;
      }
      if (b.id === CEO_ID) {
        return 1;
      }
      return this.extractSurname(a.fullName) < this.extractSurname(b.fullName) ? -1 :
        (this.extractSurname(a.fullName) > this.extractSurname(b.fullName) ? 1 : 0)
    }
      
    private extractSurname(fullName: string): string {
      return fullName.split(' ')[1];  
    }

    getAgentById(id: number): Agent {
        return this.agents.find(agent => agent.id === '' + id);
    }

    getAgentByFullName(fullName: string): Agent {
        return this.agents.find(
            agent => agent.fullName.toLowerCase() === fullName.toLowerCase());
    }
}

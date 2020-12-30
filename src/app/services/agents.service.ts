import { Injectable } from '@angular/core';

import * as rawAgents from "src/agents/agents.json";
import { Agent } from '../shared/models/agent';

@Injectable({
    providedIn: 'root',
})
export class AgentsService {
    private agents: Agent[];

    constructor() {
        this.agents = this.convertToReadableAgents();
    }

    private convertToReadableAgents(): Agent[] {
        return rawAgents.Agenci.Agent
        .filter(agent => agent.Nazwa !== 'Biuro Perfecthouse')
        .map(agent => {
            return {
                id: agent.ID,
                fullName: agent.Imie + ' ' + agent.Nazwisko,
                position: this.computePosition(agent.Nazwa),
                photoFileName: agent.PlikFoto,
                phone: agent.Telefon,
                mobile: agent.Komorka,
                mail: agent.Email,
                licenseNumber: agent.NrLicencji,
            }
        });
    }

    private computePosition(nameWithPosition: string) {
        return nameWithPosition.split(' - ')[1];
    }

    listAgents(): Agent[] {
        return this.agents;
    }

    getAgentByFullName(fullName: string): Agent {
        return this.agents.find(agent => agent.fullName === fullName);
    }
}
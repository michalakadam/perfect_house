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
        return rawAgents.Agenci.Agent.map(agent => {
            return {
                id: agent.ID,
                fullName: agent.Nazwa,
                name: agent.Imie,
                surname: agent.Nazwisko,
                position: agent.DzialFunkcja,
                photo: agent.PlikFoto,
                phone: agent.Telefon,
                mobile: agent.Komorka,
                mail: agent.Email,
                superior: agent.OdpowiedzialnyNazwa,
                superiorLicenseNumber: agent.NrLicencji,
            }
        });
    }

    listAgents(): Agent[] {
        return this.agents;
    }
}
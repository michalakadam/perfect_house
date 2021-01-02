import { Injectable } from '@angular/core';

import { Agent } from '../shared/models/agent';

@Injectable({
    providedIn: 'root',
})
export class AgentsConverter {
    
    convertToReadableAgents(rawAgents: any[]): Agent[] {
        return rawAgents
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
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentPageComponent } from './agents/agent-page/agent-page.component';
import { AgentsComponent } from './agents/agents.component';
import { ConsultancyComponent } from './consultancy/consultancy.component';
import { ContactComponent } from './contact/contact.component';
import { MainComponent } from './main/main.component';
import { OffersComponent } from './offers/offers.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RentalManagementComponent } from './rental-management/rental-management.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'oferty',
    component: OffersComponent,
    data: {
      title: 'Oferty',
    },
  },
  {
    path: 'doradztwo',
    component: ConsultancyComponent,
    data: {
      title: 'Doradztwo',
    },
  },
  {
    path: 'zarzadzanie',
    component: RentalManagementComponent,
    data: {
      title: 'Zarządzanie najmem',
    },
  },
  {
    path: 'ludzie',
    children: [
      {
        path: '',
        component: AgentsComponent,
        data: {
          title: 'Ludzie',
        },
      },
      {
        path: ':agent',
        component: AgentPageComponent,
      },
    ],
  },
  {
    path: 'kontakt',
    component: ContactComponent,
    data: {
      title: 'Kontakt',
    },
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

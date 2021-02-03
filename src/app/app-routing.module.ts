import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentPageComponent } from './agents/agent-page/agent-page.component';
import { AgentsComponent } from './agents/agents.component';
import { ConsultancyComponent } from './consultancy/consultancy.component';
import { ContactComponent } from './contact/contact.component';
import { MainComponent } from './main/main.component';
import { OfferComponent } from './offer/offer.component';
import { OffersComponent } from './offers/offers.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RentalManagementComponent } from './rental-management/rental-management.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      title: 'Perfect House',
    },
  },
  {
    path: 'oferty',
    component: OffersComponent,
    data: {
      title: 'Oferty',
    },
  },
  {
    path: 'oferta/:symbol',
    component: OfferComponent,
  },
  {
    path: 'doradztwo-kredytowe',
    component: ConsultancyComponent,
    data: {
      title: 'Doradztwo kredytowe',
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
    path: 'aktualnosci',
    component: UnderConstructionComponent,
    data: {
      title: 'Aktualności',
    },
  },
  {
    path: 'kontakt',
    component: ContactComponent,
    data: {
      title: 'Kontakt',
    },
  },
  {
    path: 'deweloperzy',
    component: UnderConstructionComponent,
    data: {
      title: 'Dla deweloperów',
    },
  },
  {
    path: 'fotowoltaika',
    component: UnderConstructionComponent,
    data: {
      title: 'Fotowoltaika',
    },
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: {
      title: '404',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

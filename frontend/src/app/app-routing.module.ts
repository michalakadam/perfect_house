import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AgentPageComponent } from "./agents/agent-page/agent-page.component";
import { AgentsComponent } from "./agents/agents.component";
import { ConsultancyComponent } from "./consultancy/consultancy.component";
import { ContactComponent } from "./contact/contact.component";
import { MainComponent } from "./main/main.component";
import { OfferComponent } from "./offer/offer.component";
import { OffersComponent } from "./offers/offers.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { ManagementComponent } from "./management/management.component";
import { ValuesComponent } from "./values/values.component";
import { NewsFeedComponent } from "./news-feed/news-feed.component";
import { EcoHousesComponent } from "./eco-houses/eco-houses.component";

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    data: {
      title: "Perfect House",
    },
  },
  {
    path: "oferty",
    component: OffersComponent,
    data: {
      title: "Oferty",
    },
  },
  {
    path: "oferta/:symbol",
    component: OfferComponent,
  },
  {
    path: "doradztwo-kredytowe",
    component: ConsultancyComponent,
    data: {
      title: "Doradztwo kredytowe",
    },
  },
  {
    path: "zarządzanie",
    component: ManagementComponent,
    data: {
      title: "Zarządzanie nieruchomościami",
    },
  },
  {
    path: "eco-domy",
    component: EcoHousesComponent,
    data: {
      title: "Nowoczesne eco domy"
    },
  },
  {
    path: "wartości",
    component: ValuesComponent,
    data: {
      title: "Nasze wartości",
    },
  },
  {
    path: "ludzie",
    component: AgentsComponent,
    data: {
      title: "Ludzie",
    },
  },
  // Router state does not recognize params of a child route.
  {
    path: "ludzie/:agent",
    component: AgentPageComponent,
  },
  {
    path: "aktualności",
    component: NewsFeedComponent,
    data: {
      title: "Aktualności",
    },
  },
  {
    path: "kontakt",
    component: ContactComponent,
    data: {
      title: "Kontakt",
    },
  },
  {
    path: "**",
    component: PageNotFoundComponent,
    data: {
      title: "404",
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

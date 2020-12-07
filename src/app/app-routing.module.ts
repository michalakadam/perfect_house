import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
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
  },
  {
    path: 'doradztwo',
    component: ConsultancyComponent,
  },
  {
    path: 'zarzadzanie',
    component: RentalManagementComponent,
  },
  {
    path: 'o-nas',
    component: AboutComponent,
  },
  {
    path: 'kontakt',
    component: ContactComponent,
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

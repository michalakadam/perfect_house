import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ConsultancyComponent } from './consultancy/consultancy.component';
import { ContactComponent } from './contact/contact.component';
import { MainComponent } from './main/main.component';
import { RentalManagementComponent } from './rental-management/rental-management.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

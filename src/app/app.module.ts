import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { MapComponent } from './shared/map/map.component';
import { AgentBriefComponent } from './shared/agent-brief/agent-brief.component';
import { RentalManagementComponent } from './rental-management/rental-management.component';
import { ConsultancyComponent } from './consultancy/consultancy.component';
import { CustomerMessageComponent } from './shared/customer-message/customer-message.component';
import { MainComponent } from './main/main.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OffersComponent } from './offers/offers.component';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    ContactComponent,
    MapComponent,
    AgentBriefComponent,
    RentalManagementComponent,
    ConsultancyComponent,
    CustomerMessageComponent,
    MainComponent,
    PageNotFoundComponent,
    OffersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDividerModule,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }

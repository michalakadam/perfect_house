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
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { NavigationComponent } from './header/navigation/navigation.component';
import { SideNavigationComponent } from './header/side-navigation/side-navigation.component';
import { FooterLinksSectionComponent } from './footer/footer-links-section/footer-links-section.component';
import { OfferCardComponent } from './offers/offer-card/offer-card.component';
import { NumberPrettifier } from './shared/pipes/number-prettifier';
import {PaginatorModule} from 'primeng/paginator';

@NgModule({
  declarations: [
    AboutComponent,
    AgentBriefComponent,
    AppComponent,
    ConsultancyComponent,
    ContactComponent,
    CustomerMessageComponent,
    FooterComponent,
    FooterLinksSectionComponent,
    HeaderComponent,
    MainComponent,
    MapComponent,
    NavigationComponent,
    NumberPrettifier,
    OfferCardComponent,
    OffersComponent,
    PageNotFoundComponent,
    RentalManagementComponent,
    SideNavigationComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    PaginatorModule,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }

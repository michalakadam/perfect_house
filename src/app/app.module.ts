import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { MapComponent } from './shared/map/map.component';
import { AgentBriefComponent } from './shared/agent-brief/agent-brief.component';
import { RentalManagementComponent } from './rental-management/rental-management.component';
import { ConsultancyComponent } from './consultancy/consultancy.component';
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
import { DropdownNavigationComponent } from './header/dropdown-navigation/dropdown-navigation.component';
import { FooterLinksSectionComponent } from './footer/footer-links-section/footer-links-section.component';
import { OfferCardComponent } from './offers/offer-card/offer-card.component';
import { NumberPrettifier } from './shared/pipes/number-prettifier';
import { PaginatorModule } from 'primeng/paginator';
import { SortingToolComponent } from './offers/sorting-tool/sorting-tool.component';
import { DropdownModule } from 'primeng/dropdown';
import { SearchToolComponent } from './offers/search-tool/search-tool.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { AgentsComponent } from './agents/agents.component';
import { PaginatorComponent } from './offers/paginator/paginator.component';

@NgModule({
  declarations: [
    AgentBriefComponent,
    AppComponent,
    ConsultancyComponent,
    ContactComponent,
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
    DropdownNavigationComponent,
    SortingToolComponent,
    SearchToolComponent,
    AgentsComponent,
    PaginatorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    PaginatorModule,
    SelectButtonModule,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }

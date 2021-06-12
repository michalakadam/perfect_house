import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { ContactComponent } from "./contact/contact.component";
import { MapComponent } from "./shared/map/map.component";
import { AgentBriefComponent } from "./shared/agent-brief/agent-brief.component";
import { ManagementComponent } from "./management/management.component";
import { ConsultancyComponent } from "./consultancy/consultancy.component";
import { MainComponent } from "./main/main.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { OffersComponent } from "./offers/offers.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { NavigationComponent } from "./header/navigation/navigation.component";
import { DropdownNavigationComponent } from "./header/dropdown-navigation/dropdown-navigation.component";
import { FooterLinksSectionComponent } from "./footer/footer-links-section/footer-links-section.component";
import { OfferCardComponent } from "./offers/offer-card/offer-card.component";
import { NumberPrettifier } from "./shared/pipes/number-prettifier";
import { PaginatorModule } from "primeng/paginator";
import { SortingToolComponent } from "./offers/sorting-tool/sorting-tool.component";
import { DropdownModule } from "primeng/dropdown";
import { SearchToolComponent } from "./offers/search-tool/search-tool.component";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { SelectButtonModule } from "primeng/selectbutton";
import { ButtonModule } from "primeng/button";
import { AgentsComponent } from "./agents/agents.component";
import { PaginatorComponent } from "./offers/paginator/paginator.component";
import { AgentPageComponent } from "./agents/agent-page/agent-page.component";
import { OfferComponent } from "./offer/offer.component";
import { CheckboxModule } from "primeng/checkbox";
import { InputComponent } from "./offers/search-tool/input/input.component";
import { SliderModule } from "primeng/slider";
import { GalleriaModule } from "primeng/galleria";
import { InputWithSliderComponent } from "./offers/search-tool/input-with-slider/input-with-slider.component";
import { CarouselModule } from "primeng/carousel";
import { OfferDetailsComponent } from "src/app/offers/offer-card/offer-details/offer-details.component";
import { UnderConstructionComponent } from "./under-construction/under-construction.component";
import { TabViewModule } from "primeng/tabview";
import { GroupedDropdownComponent } from "./offers/search-tool/grouped-dropdown/grouped-dropdown.component";
import { ValuesComponent } from "./values/values.component";
import { PhotovoltaicsComponent } from "./photovoltaics/photovoltaics.component";
import { GalleryComponent } from "./shared/gallery/gallery.component";
import { UrlSanitizer } from "./shared/pipes/url-sanitizer";
import { StringDecoder } from "./shared/pipes/string-decoder";
import { NewsFeedComponent } from "./news-feed/news-feed.component";
import { StarRatingComponent } from "./offer/star-rating/star-rating.component";
import { StateManagementModule } from "./state-management/state-management.module";
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

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
    UrlSanitizer,
    StringDecoder,
    OfferCardComponent,
    OffersComponent,
    PageNotFoundComponent,
    ManagementComponent,
    DropdownNavigationComponent,
    SortingToolComponent,
    SearchToolComponent,
    AgentsComponent,
    PaginatorComponent,
    AgentPageComponent,
    OfferComponent,
    InputComponent,
    OfferDetailsComponent,
    UnderConstructionComponent,
    InputWithSliderComponent,
    InputWithSliderComponent,
    OfferDetailsComponent,
    UnderConstructionComponent,
    GroupedDropdownComponent,
    ValuesComponent,
    PhotovoltaicsComponent,
    GalleryComponent,
    NewsFeedComponent,
    StarRatingComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    CarouselModule,
    CheckboxModule,
    DropdownModule,
    FormsModule,
    GalleriaModule,
    InputTextModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    PaginatorModule,
    SelectButtonModule,
    SliderModule,
    TabViewModule,
    StateManagementModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

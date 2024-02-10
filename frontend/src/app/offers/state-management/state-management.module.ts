import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OffersEffects } from './effects';
import * as offers from './reducers';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(offers.stateKey, offers.reducer),
    EffectsModule.forFeature([OffersEffects]),
  ],
})
export class OffersStateManagementModule {}

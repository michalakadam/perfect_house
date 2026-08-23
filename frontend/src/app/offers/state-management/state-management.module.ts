import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OffersEffects } from './effects';
import * as offers from './reducers';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(offers.stateKey, offers.reducer),
    EffectsModule.forFeature([OffersEffects]),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class OffersStateManagementModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { AgentsEffects } from "./effects";
import * as agents from "./reducers";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(agents.stateKey, agents.reducer),
    EffectsModule.forFeature([AgentsEffects]),
  ],
})
export class AgentsStateManagementModule {}

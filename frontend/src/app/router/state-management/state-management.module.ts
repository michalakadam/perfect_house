import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { routerReducer, StoreRouterConnectingModule } from "@ngrx/router-store";
import { RouterSerializer } from "./serializer";

export const stateKey = "router";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(stateKey, routerReducer),
    StoreRouterConnectingModule.forRoot({
      stateKey: stateKey,
      serializer: RouterSerializer,
    }),
  ],
})
export class RouterStateManagementModule {}

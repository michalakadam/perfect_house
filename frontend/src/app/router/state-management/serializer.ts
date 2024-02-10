import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { PerfectRoute } from './models';

export class RouterSerializer implements RouterStateSerializer<PerfectRoute> {
  serialize(routerState: RouterStateSnapshot): PerfectRoute {
    let route = routerState.root;

    if (route.firstChild) {
      route = route.firstChild;
    }

    return {
      url: routerState.url,
      params: route.params,
      queryParams: routerState.root.queryParams,
    };
  }
}

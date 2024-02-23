import { Params } from '@angular/router';

export interface PerfectRoute {
  url: string;
  params: Params;
  queryParams: Params;
}

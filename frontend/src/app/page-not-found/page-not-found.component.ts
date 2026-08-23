import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'perfect-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PageNotFoundComponent {}

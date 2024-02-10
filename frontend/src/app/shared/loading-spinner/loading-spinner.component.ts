import { Component, ChangeDetectionStrategy } from '@angular/core';

// Source: https://tobiasahlin.com/spinkit/
@Component({
  selector: 'perfect-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}

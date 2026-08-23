import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'perfect-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ValuesComponent {}

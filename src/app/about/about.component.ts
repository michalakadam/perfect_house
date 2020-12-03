import { Component, ChangeDetectionStrategy } from '@angular/core';

/** Kontener strony 'O nas'. Zawiera opis firmy oraz listę pracowników. */
@Component({
  selector: 'perfect-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}

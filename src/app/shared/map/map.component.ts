import { Component, ChangeDetectionStrategy } from '@angular/core';

/** Wyświetla mapę wraz z lokalizacją przekazaną do komponentu. */
@Component({
  selector: 'perfect-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {}

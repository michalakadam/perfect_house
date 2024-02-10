import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';

declare let ol: any;

/** Wyświetla mapę wraz z lokalizacją przekazaną do komponentu. */
@Component({
  selector: 'perfect-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  @Input() lattitude: number;
  @Input() longitude: number;

  map: any;

  ngOnInit() {
    // Initialize map asynchronously to avoid map not loading on consecutive pages.
    setTimeout(() => {
      this.map = new ol.Map({
        target: 'map',
        layers: [new ol.layer.Tile({ source: new ol.source.OSM() })],
        view: new ol.View({
          center: ol.proj.fromLonLat([this.longitude, this.lattitude]),
          zoom: 15,
        }),
      });

      if (this.lattitude && this.longitude) {
        this.addPoint(this.lattitude, this.longitude);
      }
    });
  }

  addPoint(lat: number, lng: number) {
    let vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [
          new ol.Feature({
            geometry: new ol.geom.Point(
              ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'),
            ),
          }),
        ],
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.7],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: '/assets/pin.png',
        }),
      }),
    });

    this.map.addLayer(vectorLayer);
  }
}

import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'perfect-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {}

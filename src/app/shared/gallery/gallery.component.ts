import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';

@Component({
  selector: 'perfect-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent implements OnInit {
  @Input() photoUrls: string[] = [];
  currentPhotoUrl = '';
  currentPhotoIndex = -1;

  ngOnInit() {
    this.currentPhotoUrl = this.photoUrls[0];
    this.currentPhotoIndex = 0;
  }

  isPreviousPhotoAvailable() {
    return this.currentPhotoIndex !== -1 && this.currentPhotoIndex > 0;
  }

  isNextPhotoAvailable() {
    return this.currentPhotoIndex !== -1 && this.currentPhotoIndex < this.photoUrls.length - 1;
  }

  loadPreviousPhoto() {
    this.currentPhotoIndex = this.currentPhotoIndex - 1;
    this.currentPhotoUrl = this.photoUrls[this.currentPhotoIndex];
  }

  loadNextPhoto() {
    this.currentPhotoIndex = this.currentPhotoIndex + 1;
    this.currentPhotoUrl = this.photoUrls[this.currentPhotoIndex];
  }
}

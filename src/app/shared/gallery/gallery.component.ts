import { Component, ChangeDetectionStrategy, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

const HORIZONTAL_PHOTO_MAX_WIDTH = 750;

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
  isCurrentPhotoVertical = false;
  @ViewChild('current') currentPhoto: ElementRef;

  ngOnInit() {
    this.currentPhotoUrl = this.photoUrls[0];
    this.currentPhotoIndex = 0;
  }

  determineCurrentImageDimensions() {
    this.isCurrentPhotoVertical =
      (this.currentPhoto.nativeElement as HTMLImageElement).naturalWidth < HORIZONTAL_PHOTO_MAX_WIDTH;
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

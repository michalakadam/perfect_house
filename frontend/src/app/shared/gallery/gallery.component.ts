import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { WindowSizeDetector } from '../services/window-size-detector.service';

const HORIZONTAL_PHOTO_MAX_WIDTH_TO_HEIGHT_RATIO = 1.2;

@Component({
  selector: 'perfect-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent implements OnInit {
  @Input() photoUrls: string[] = [];
  photosInCarousel: string[] = [];
  currentPhotoUrl = '';
  currentPhotoIndex = -1;
  isCurrentPhotoVertical = false;
  numberOfPhotosInCarousel = 7;
  carouselStartIndex: number;
  carouselEndIndex: number;
  @ViewChild('current') currentPhoto: ElementRef;

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.windowSizeDetector.windowSizeChanged$.subscribe(() => {
      this.computeNumberOfPhotosInCarousel();

      if (this.currentPhotoIndex > -1) {
        this.initializeCarousel();
        this.changeDetector.detectChanges();
      }
    });
  }

  ngOnInit() {
    this.computeNumberOfPhotosInCarousel();
    this.initializeCarousel();
  }

  private computeNumberOfPhotosInCarousel() {
    if (!this.windowSizeDetector.isWindowSmallerThanDesktopLarge) {
      this.numberOfPhotosInCarousel = 7;
    } else if (!this.windowSizeDetector.isWindowSmallerThanDesktopMedium) {
      this.numberOfPhotosInCarousel = 6;
    } else if (!this.windowSizeDetector.isWindowSmallerThanDesktopSmall) {
      this.numberOfPhotosInCarousel = 5;
    }
  }

  private initializeCarousel() {
    this.currentPhotoUrl = this.photoUrls[0];
    this.currentPhotoIndex = 0;
    this.computePhotosInCarousel(0);
  }

  determineCurrentPhotoLayout() {
    this.isCurrentPhotoVertical = this.isPhotoVertical(
      this.currentPhoto.nativeElement as HTMLImageElement
    );
  }

  isPreviousPhotoAvailable() {
    return this.currentPhotoIndex !== -1 && this.currentPhotoIndex > 0;
  }

  isNextPhotoAvailable() {
    return (
      this.currentPhotoIndex !== -1 &&
      this.currentPhotoIndex < this.photoUrls.length - 1
    );
  }

  loadPreviousPhoto() {
    const previousPhotoIndex = this.currentPhotoIndex - 1;
    if (previousPhotoIndex < this.carouselStartIndex) {
      this.loadPreviousPhotos();
    }
    this.updateCurrentPhoto(previousPhotoIndex);
  }

  loadNextPhoto() {
    this.updateCurrentPhoto(this.currentPhotoIndex + 1);
    if (this.currentPhotoIndex > this.carouselEndIndex) {
      this.loadNextPhotos();
    }
  }

  private updateCurrentPhoto(index: number) {
    this.currentPhotoIndex = index;
    this.currentPhotoUrl = this.photoUrls[index];
  }

  isNextPhotosButtonHidden(): boolean {
    return (
      this.carouselEndIndex === this.photoUrls.length - 1 ||
      this.photoUrls.length <= this.numberOfPhotosInCarousel
    );
  }

  private computePhotosInCarousel(startIndex: number) {
    this.carouselStartIndex = startIndex;
    this.carouselEndIndex = startIndex + this.numberOfPhotosInCarousel - 1;
    this.photosInCarousel = [...this.photoUrls].splice(
      startIndex,
      this.numberOfPhotosInCarousel
    );
  }

  selectPhoto(photoUrl) {
    this.currentPhotoUrl = photoUrl;
    this.currentPhotoIndex = this.photoUrls.indexOf(photoUrl);
  }

  isPhotoVertical(photo: HTMLImageElement): boolean {
    return (
      photo.naturalWidth / photo.naturalHeight <
      HORIZONTAL_PHOTO_MAX_WIDTH_TO_HEIGHT_RATIO
    );
  }

  loadNextPhotos() {
    const runningOutOfPhotos =
      this.photoUrls.length <=
      this.carouselEndIndex + this.numberOfPhotosInCarousel;
    const startIndex = runningOutOfPhotos
      ? this.photoUrls.length - this.numberOfPhotosInCarousel
      : this.carouselEndIndex + 1;

    this.computePhotosInCarousel(startIndex);
    this.updateCurrentPhoto(this.carouselStartIndex);
  }

  loadPreviousPhotos() {
    const runningOutOfPhotos =
      this.carouselStartIndex - this.numberOfPhotosInCarousel < 0;
    const startIndex = runningOutOfPhotos
      ? 0
      : this.carouselStartIndex - this.numberOfPhotosInCarousel;

    this.computePhotosInCarousel(startIndex);
    this.updateCurrentPhoto(this.carouselStartIndex);
  }
}

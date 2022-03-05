import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { WindowSizeDetector } from "../services/window-size-detector.service";

const HORIZONTAL_PHOTO_MAX_WIDTH_TO_HEIGHT_RATIO = 1.2;

@Component({
  selector: "perfect-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  private photos: string[] = [];
  @Input()
  public set photoUrls(value: string[]) {
    if (value?.length) {
      this.photos = value;
      this.computeNumberOfPhotosInCarousel();
      this.initializeCarousel();
    }
  }
  photosInCarousel: string[] = [];
  currentPhotoUrl = "";
  currentPhotoIndex = -1;
  isCurrentPhotoVertical = false;
  numberOfPhotosInCarousel = 7;
  carouselStartIndex: number;
  carouselEndIndex: number;
  @ViewChild("current") currentPhoto: ElementRef;

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
    this.currentPhotoUrl = this.photos[0];
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
      this.currentPhotoIndex < this.photos.length - 1
    );
  }

  loadPreviousPhoto() {
    if (this.currentPhotoIndex === 0) {
      return;
    }
    const previousPhotoIndex = this.currentPhotoIndex - 1;
    if (previousPhotoIndex < this.carouselStartIndex) {
      this.loadPreviousPhotos();
    }
    this.updateCurrentPhoto(previousPhotoIndex);
  }

  loadNextPhoto() {
    if (this.currentPhotoIndex === this.photos.length -1) {
      return;
    }
    this.updateCurrentPhoto(this.currentPhotoIndex + 1);
    if (this.currentPhotoIndex > this.carouselEndIndex) {
      this.loadNextPhotos();
    }
  }

  private updateCurrentPhoto(index: number) {
    this.currentPhotoIndex = index;
    this.currentPhotoUrl = this.photos[index];
  }

  isNextPhotosButtonHidden(): boolean {
    return (
      this.carouselEndIndex === this.photos.length - 1 ||
      this.photos.length <= this.numberOfPhotosInCarousel
    );
  }

  private computePhotosInCarousel(startIndex: number) {
    this.carouselStartIndex = startIndex;
    this.carouselEndIndex = startIndex + this.numberOfPhotosInCarousel - 1;
    this.photosInCarousel = [...this.photos].splice(
      startIndex,
      this.numberOfPhotosInCarousel
    );
  }

  selectPhoto(photoUrl) {
    this.currentPhotoUrl = photoUrl;
    this.currentPhotoIndex = this.photos.indexOf(photoUrl);
  }

  isPhotoVertical(photo: HTMLImageElement): boolean {
    return (
      photo.naturalWidth / photo.naturalHeight <
      HORIZONTAL_PHOTO_MAX_WIDTH_TO_HEIGHT_RATIO
    );
  }

  loadNextPhotos() {
    const runningOutOfPhotos =
      this.photos.length <=
      this.carouselEndIndex + this.numberOfPhotosInCarousel;
    const startIndex = runningOutOfPhotos
      ? this.photos.length - this.numberOfPhotosInCarousel
      : this.carouselEndIndex + 1;

    this.computePhotosInCarousel(startIndex);
    this.updateCurrentPhoto(runningOutOfPhotos ? this.currentPhotoIndex : this.carouselStartIndex);
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

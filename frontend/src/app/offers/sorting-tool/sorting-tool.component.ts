import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowSizeDetector } from 'src/app/shared/services/window-size-detector.service';
import { Sorting, AVAILABLE_SORTINGS } from 'src/app/shared/models';

@Component({
  selector: 'perfect-sorting-tool',
  templateUrl: './sorting-tool.component.html',
  styleUrls: ['./sorting-tool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortingToolComponent implements OnDestroy {
  private subscription: Subscription;
  availableSortings = AVAILABLE_SORTINGS;
  @Input() offersQuantity = 0;
  @Input() selectedSorting: Sorting;
  @Output() sortingChanged = new EventEmitter<Sorting>();

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    readonly changeDetector: ChangeDetectorRef,
  ) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(
      () => {
        this.changeDetector.detectChanges();
      },
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

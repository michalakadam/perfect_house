import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { Sorting, AVAILABLE_SORTINGS } from 'src/app/shared/models/sorting';

@Component({
  selector: 'perfect-sorting-tool',
  templateUrl: './sorting-tool.component.html',
  styleUrls: ['./sorting-tool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortingToolComponent {
  availableSortings = AVAILABLE_SORTINGS;
  @Input() offersQuantity = 0;
  @Input() selectedSorting: Sorting;
  @Output() sortingChanged = new EventEmitter<Sorting>();
}

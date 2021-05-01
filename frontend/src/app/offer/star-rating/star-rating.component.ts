import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'perfect-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRatingComponent implements OnInit {
  @Input() score = 0;
  @Input() outOf = 5;
  filled: number[] = [];
  empty: number[] = [];

  ngOnInit() {
    this.filled = Array(this.score)
      .fill(0)
      .map((x, i) => i);
    this.empty = Array(this.outOf - this.score)
      .fill(0)
      .map((x, i) => i);
  }
}

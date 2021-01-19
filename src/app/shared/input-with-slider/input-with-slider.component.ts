import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'perfect-input-with-slider',
  templateUrl: './input-with-slider.component.html',
  styleUrls: ['./input-with-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputWithSliderComponent {
  @Input() title = '';
  @Input() 
    public set lowerDefaultValue(value: number) {
      this.lowerDefault = value;
      this.minValue = value;
    }
  @Input() 
    public set higherDefaultValue(value: number) {
      this.higherDefault = value;
      this.maxValue = value;
    }
  @Input() 
    public set lowerValue(value: number) {
      this.lower = value;
      this.updateRange();
    }
  @Input() 
    public set higherValue(value: number) {
      this.higher = value;
      this.updateRange();
    }
  
  lower = 0;
  higher = 0;
  lowerDefault = 0;
  higherDefault = 0;
  minValue = 0;
  maxValue = 0;
  range = [0, 0];

  @Output() valuesChanged = new EventEmitter<number[]>();
  @Output() slidingIsOver = new EventEmitter();

  updateLowerValue(value: string) {
    this.lower = this.computeValue(this.convertToNumericValue(value));
  }

  updateHigherValue(value: string) {
    this.higher = this.computeValue(this.convertToNumericValue(value));
  }

  private updateRange() {
    this.range = [this.lower, this.higher];
  }

  private convertToNumericValue(value: string): number {
    return value ? Number(value) : -1;
  }

  private computeValue(value: number): number {
    if (value < this.minValue) {
      return this.minValue;
    }
    if (value > this.maxValue) {
      return this.maxValue;
    }
    return value;
  }

  updateValues({values}) {
    this.lower = values[0];
    this.higher = values[1];
    this.updateRange();
    this.valuesChanged.emit(this.range);
  }
}

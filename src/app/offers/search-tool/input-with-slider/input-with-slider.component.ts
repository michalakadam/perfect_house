import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

enum PositionOnScale {
  LOWER,
  HIGHER,
}

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
      if (value === -1) {
        value = this.lowerDefault;
      }
      this.lower = value;
      this.updateRange();
    }
  @Input() 
    public set higherValue(value: number) {
      if (value === -1) {
        value = this.higherDefault;
      }
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
    this.updateValues([this.convertToNumericValue(value), this.higher]);
  }

  updateHigherValue(value: string) {
    this.updateValues([this.lower, this.convertToNumericValue(value)]);
  }

  private updateRange() {
    this.range = [this.lower, this.higher];
  }

  private convertToNumericValue(value: string): number {
    return value ? Number(value) : -1;
  }

  private computeValue(value: number, positionOnScale: PositionOnScale): number {
    if (value < this.minValue) {
      return this.minValue;
    }
    if (value > this.maxValue) {
      return this.maxValue;
    }
    if (positionOnScale === PositionOnScale.LOWER && value > this.higher) {
      return this.higher;
    }
    if (positionOnScale === PositionOnScale.HIGHER && value < this.lower) {
      return this.lower;
    }
    return value;
  }

  updateValues(values: number[]) {
    this.lower = this.computeValue(values[0], PositionOnScale.LOWER);
    this.higher = this.computeValue(values[1], PositionOnScale.HIGHER);
    this.updateRange();
    this.valuesChanged.emit(this.range);
  }
}

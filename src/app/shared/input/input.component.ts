import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'perfect-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input() lhsIcon = '';
  @Input() title = '';
  @Input() type = 'text'
  @Input() defaultValue = '';

  @Output()valueChange = new EventEmitter<string>();

  inputValue : string;

  @Input()
  get value(){
    return this.inputValue;
  }

  set value(val: string) {
    this.inputValue = val;
    this.valueChange.emit(this.inputValue);
  }
  
  @ViewChild('input') input: ElementRef;

  removeContent() {
    this.value = this.defaultValue;
    this.input.nativeElement.classList.remove('p-filled');
  }
}

import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'perfect-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input() lhsIcon = '';
  @Input() title = '';
  @Input() type = 'text';
  @Input() defaultValue = '';
  @Input() isRemovable = true;
  @Input() options: string[] = [];

  @Output() valueChange = new EventEmitter<string>();
  @Output() readyForSearch = new EventEmitter();

  isDropdownVisible = false;
  inputValue: string;
  inFocus = false;

  @Input()
  get value() {
    return this.inputValue;
  }

  set value(val: string) {
    this.inputValue = val;
    if (this.inputValue) {
      this.inFocus = true;
    }
    this.valueChange.emit(this.inputValue);
  }

  @ViewChild('input') input: ElementRef;

  @HostListener('click', ['$event'])
  clickInside(event: any) {
    if (!event.path[0].classList.contains('remove-input-icon')) {
      setTimeout(() => {
        this.inFocus = true;
        this.changeDetector.detectChanges();
      }, 200);
    }
  }

  @HostListener('document:click')
  clickOutside() {
    this.inFocus = false;
    this.changeDetector.detectChanges();
  }

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  computeLabelVisibility(): boolean {
    return !!this.title && (!!this.inputValue || this.inFocus);
  }

  removeContent() {
    this.value = this.defaultValue;
    this.isDropdownVisible = false;
    this.input.nativeElement.classList.remove('p-filled');
    this.inFocus = false;
    this.readyForSearch.emit();
  }

  filterOptions(currentValue: string): string[] {
    return this.options.filter((option) => {
      const optionSplitted = option.toLowerCase().split(', ');
      return (
        optionSplitted[0]?.startsWith(currentValue.toLowerCase()) ||
        optionSplitted[1]?.startsWith(currentValue.toLowerCase())
      );
    });
  }

  optionSelected(option: string) {
    this.value = option;
    this.isDropdownVisible = false;
    this.readyForSearch.emit();
  }

  computeDropdownVisibility(value: string) {
    const filteredOptions = this.filterOptions(value);
    if (!value.length || !filteredOptions.length) {
      this.isDropdownVisible = false;
    } else if (value.length && filteredOptions.length) {
      this.isDropdownVisible = true;
    }
  }

  computeIndex(i: number): number {
    return ++i;
  }
}

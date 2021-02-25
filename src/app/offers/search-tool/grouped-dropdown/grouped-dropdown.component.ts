import { Component, Input, ChangeDetectionStrategy, HostListener, Output, EventEmitter } from '@angular/core';

export interface DropdownGroup {
  displayName: string;
  values: DropdownValue[];
  isVisible: boolean;
  isSelected: boolean;
}

export interface DropdownValue {
  displayName: string;
  isSelected: boolean;
}

@Component({
  selector: 'perfect-grouped-dropdown',
  templateUrl: './grouped-dropdown.component.html',
  styleUrls: ['./grouped-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedDropdownComponent {
  clickedInside = false;
  isDropdownVisible = false;
  selected = '';
  
  @Input() placeholder = '';
  @Input() hideGroupNameWhenValueSelected = false;
  @Input() valueNamePrefix = '';

  @Output() onChange = new EventEmitter<DropdownGroup[]>();

  groupsWithValues: DropdownGroup[] = [];

  @Input()
  get groups(): DropdownGroup[] {
    return this.groupsWithValues;
  }

  set groups(val: DropdownGroup[]) {
    this.groupsWithValues = val;
    const selectedGroup = this.groupsWithValues.find(group => group.isSelected);
    if (selectedGroup) {
      this.selected = this.computeSelected(selectedGroup);
    }
  }

  @HostListener('click')
  clickInside() {
    this.clickedInside = true;
  }

  @HostListener('document:click')
  clickOutside() {
    if (!this.clickedInside) {
      this.isDropdownVisible = false;
    }
    this.clickedInside = false;
  }

  toggleDropdownVisibility() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  toggleGroupVisibility(group: DropdownGroup) {
    const otherGroups = this.groupsWithValues
      .filter(g => g.displayName !== group.displayName)

    for (const group of otherGroups) {
      group.isVisible = false;
    }
    group.isVisible = !group.isVisible;
  }

  groupSelected(group: DropdownGroup) {
    this.selected = this.computeSelected(group);
    this.select(group);
    this.isDropdownVisible = false;
    this.onChange.emit();
  }

  valueSelected(group: DropdownGroup, value: DropdownValue) {
    this.select(group, value);
    this.selected = this.computeSelected(group);
    this.isDropdownVisible = false;
    this.onChange.emit();
  }

  private computeSelected(group: DropdownGroup) {
    const selectedValue = group.values.find(value => value.isSelected);
    if (!selectedValue) {
      return group.displayName;
    }
    return this.hideGroupNameWhenValueSelected ?
      this.valueNamePrefix + ' ' + selectedValue.displayName :
      group.displayName + '/' + selectedValue.displayName;

  }

  private select(group: DropdownGroup, value?: DropdownValue) {
    for (const group of this.groupsWithValues) {
      group.isSelected = false;
      group.isVisible = false;
      for (const value of group.values) {
        value.isSelected = false;
      }
    }

    group.isSelected = true;
    if (value) {
      value.isSelected = true;
      group.isVisible = true;
    }
  }

  deselectAll() {
    for (const group of this.groupsWithValues) {
      group.isSelected = false;
      group.isVisible = false;
      for (const value of group.values) {
        value.isSelected = false;
      }
    }
    this.selected = '';
    this.isDropdownVisible = false;
    this.onChange.emit();
  }
}

import { Component, Input, ChangeDetectionStrategy, HostListener } from '@angular/core';

export interface DropdownGroup {
  displayName: string;
  values: string[];
  isVisible?: boolean;
  isSelected?: boolean;
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
  
  @Input() selected = '';
  @Input() placeholder = '';
  @Input() groupsWithValues: DropdownGroup[] = [];

  @HostListener('click')
  clickInside() {
    this.clickedInside = true;
  }
  
  @HostListener('document:click')
  clickout() {
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

  isValueSelected(group, value) {
    return group.isSelected && this.selected.includes(value);
  }

  groupSelected(group: DropdownGroup) {
    this.selected = group.displayName;
    group.isVisible = false;
    this.selectGroup(group);
    this.isDropdownVisible = false;
  }

  valueSelected(group: DropdownGroup, value: string) {
    this.selected = group.displayName + '/' + value;
    this.selectGroup(group);
    this.isDropdownVisible = false;
  }

  private selectGroup(group: DropdownGroup) {
    const otherGroups = this.groupsWithValues
      .filter(g => g.displayName !== group.displayName)

    for (const group of otherGroups) {
      group.isSelected = false;
    }

    group.isSelected = true;
  }
}

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'perfect-dropdown-navigation',
  templateUrl: './dropdown-navigation.component.html',
  styleUrls: ['./dropdown-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownNavigationComponent {
  @Input() links = [];
  @Input() isSideNavigation = false;
}

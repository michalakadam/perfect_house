import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'perfect-dropdown-navigation',
  templateUrl: './dropdown-navigation.component.html',
  styleUrls: ['./dropdown-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownNavigationComponent {
  @Input() links = [];
  isSideNavigation = false;
  @Input()
  set sideNavigation(value: boolean) {
    this.isSideNavigation = coerceBooleanProperty(value);
  }
}

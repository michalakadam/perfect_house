import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MENU_LINKS } from 'src/app/header/menu-links';

@Component({
  selector: 'perfect-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavigationComponent {
  links = MENU_LINKS;
}

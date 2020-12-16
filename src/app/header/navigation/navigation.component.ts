import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MENU_LINKS } from 'src/app/header/menu-links';

@Component({
  selector: 'perfect-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  links = MENU_LINKS;
}

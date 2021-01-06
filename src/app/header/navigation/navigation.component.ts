import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MENU_LINKS } from 'src/app/header/menu-links';

@Component({
  selector: 'perfect-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  links = MENU_LINKS;
  
  @Output() aboutUsToggled = new EventEmitter();

  constructor(private router: Router) {}

  isAboutUsActive() {
    return this.router.url === '/ludzie' || this.router.url === '/aktualnosci';
  }
}

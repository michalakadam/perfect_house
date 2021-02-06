import { Component, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MENU_LINKS } from 'src/app/header/menu-links';

@Component({
  selector: 'perfect-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnDestroy {
  private subscription: Subscription;

  links = MENU_LINKS;
  isAboutUsClicked = false;
  
  @Output() aboutUsToggled = new EventEmitter();

  constructor(private router: Router,
    private changeDetector: ChangeDetectorRef) {
      this.subscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (event.url === '/') {
            this.changeDetector.detectChanges();
          }
        }
      });
  }

  handleAboutUsClick() {
    this.isAboutUsClicked = true;
    this.aboutUsToggled.emit()
  }

  isAboutUsActive() {
    const clicked = this.isAboutUsClicked;
    this.isAboutUsClicked = false;

    return clicked || this.router.url === '/ludzie' ||
      this.router.url === '/aktualnosci' || this.router.url === '/wartosci';
  }

  isOffersLinkActive() {
    return this.router.url.includes('/ofert');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

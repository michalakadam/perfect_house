import { Component, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MENU_LINKS } from 'src/app/header/menu-links';

const ABOUT_US_LINKS = ['/ludzie', '/aktualnosci', '/wartosci'];

@Component({
  selector: 'perfect-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnDestroy {
  private subscription: Subscription;

  links = MENU_LINKS;
  isAboutUsActive = false;
  
  @Output() aboutUsToggled = new EventEmitter();

  constructor(private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef) {
      this.subscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isAboutUsActive = false;
          if (ABOUT_US_LINKS.indexOf(event.url) > -1) {
            this.isAboutUsActive = true;
            this.changeDetector.detectChanges();
          }
          if (event.url === '/') {
            this.changeDetector.detectChanges();
          }
        }
      });
  }

  isOffersLinkActive() {
    return this.router.url.includes('/ofert');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

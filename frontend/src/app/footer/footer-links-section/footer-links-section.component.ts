import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'perfect-footer-links-section',
  templateUrl: './footer-links-section.component.html',
  styleUrls: ['./footer-links-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openCloseLinks', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.25s ease', style({ height: 100, opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: 100, opacity: 1 }),
        animate('0.25s ease', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class FooterLinksSectionComponent {
  @Input() headerTitle: string;
  @Input() showResponsiveView = false;
  @Input() isSectionOpen = false;

  @Output() sectionToggled = new EventEmitter();

  computeSectionMargin(): number {
    return this.showResponsiveView && !this.isSectionOpen ? -15 : 0;
  }
}

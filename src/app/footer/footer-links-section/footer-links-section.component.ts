import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'perfect-footer-links-section',
  templateUrl: './footer-links-section.component.html',
  styleUrls: ['./footer-links-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
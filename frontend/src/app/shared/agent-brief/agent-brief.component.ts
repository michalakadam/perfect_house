import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { WindowSizeDetector } from 'src/app/shared/services/window-size-detector.service';
import { Agent } from '../models';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subscription } from 'rxjs';

/** Awatar pracownika. Zawiera zdjęcie, imię i nazwisko oraz tytuł zawodowy. */
@Component({
  selector: 'perfect-agent-brief',
  templateUrl: './agent-brief.component.html',
  styleUrls: ['./agent-brief.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentBriefComponent implements OnDestroy {
  private subscription: Subscription;

  isContactInfoVisible = false;
  isVertical = false;
  isBigger = false;
  isOnlyPhotoVisible = false;
  isLicenseNumberVisible = false;

  @Input() agent: Agent;
  @Input()
  set contactInfoVisible(value: boolean) {
    this.isContactInfoVisible = coerceBooleanProperty(value);
  }
  @Input()
  set vertical(value: boolean) {
    this.isVertical = coerceBooleanProperty(value);
  }
  @Input()
  set bigger(value: boolean) {
    this.isBigger = coerceBooleanProperty(value);
  }
  @Input()
  set onlyPhoto(value: boolean) {
    this.isOnlyPhotoVisible = coerceBooleanProperty(value);
  }
  @Input()
  set licenseNumberVisible(value: boolean) {
    this.isLicenseNumberVisible = coerceBooleanProperty(value);
  }

  constructor(
    readonly windowSizeDetector: WindowSizeDetector,
    readonly changeDetector: ChangeDetectorRef
  ) {
    this.subscription = this.windowSizeDetector.windowSizeChanged$.subscribe(
      () => {
        this.changeDetector.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

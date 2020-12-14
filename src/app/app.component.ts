import { Component, HostListener, OnInit } from '@angular/core';
import { WindowSizeDetector } from 'src/app/services/window-size-detector.service';

@Component({
  selector: 'perfect-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(public windowSizeDetector: WindowSizeDetector) {}

  ngOnInit() {
    this.windowSizeDetector.updateWindowSizeFlags(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
      this.windowSizeDetector.updateWindowSizeFlags(window.innerWidth);
  }
}

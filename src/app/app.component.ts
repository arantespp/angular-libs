import { Component } from '@angular/core';

import { NgGoogleMapsLoaderService } from 'dist/ng-google-maps-loader';
import { NgGoogleMapsPlacerService } from 'dist/ng-google-maps-placer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(ngGoogleMapsLoaderService: NgGoogleMapsLoaderService,
              private ngGoogleMapsPlacerService: NgGoogleMapsPlacerService) {
    // ngGoogleMapsLoaderService.load();
  }

  open() {
    this.ngGoogleMapsPlacerService.openPlacer();
  }
}

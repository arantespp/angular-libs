import { Component } from '@angular/core';

import { NgGoogleMapsLoaderService } from 'dist/ng-google-maps-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(ngGoogleMapsLoaderService: NgGoogleMapsLoaderService) {
    ngGoogleMapsLoaderService.load();
  }
}

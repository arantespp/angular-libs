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
  place: any;
  constructor(ngGoogleMapsLoaderService: NgGoogleMapsLoaderService,
              private ngGoogleMapsPlacerService: NgGoogleMapsPlacerService) {
    ngGoogleMapsLoaderService.load();
  }

  open() {
    this.ngGoogleMapsPlacerService.openPlacer(this.place).beforeClose().subscribe((place) => {
      console.log(place);
      this.place = place;
    });
  }
}

import { Component } from '@angular/core';

import { LoadGoogleMapsService } from 'dist/ng-load-google-maps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(loadGoogleMapsService: LoadGoogleMapsService) {
    loadGoogleMapsService.load();
  }
}

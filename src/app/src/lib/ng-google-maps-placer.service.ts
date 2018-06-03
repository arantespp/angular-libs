import { Injectable, Inject } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material';
import { NgGoogleMapsPlacerComponent } from './ng-google-maps-placer.component';
import { NgGoogleMapsPlacerConfig } from './ng-google-maps-placer.config';
import { Place } from './place';

@Injectable({
  providedIn: 'root'
})
export class NgGoogleMapsPlacerService {

  constructor(@Inject(NgGoogleMapsPlacerConfig) private ngGoogleMapsPlacerConfig: NgGoogleMapsPlacerConfig,
              private dialog: MatDialog) { }

  openPlacer(place?: Place): MatDialogRef<NgGoogleMapsPlacerComponent> {
    return this.dialog.open(NgGoogleMapsPlacerComponent, {
      width: '95vw',
      maxWidth: '800px',
      height: '95vh',
      maxHeight: '95vh',
      data: place || this.ngGoogleMapsPlacerConfig.defaultPlace,
    });
  }
}

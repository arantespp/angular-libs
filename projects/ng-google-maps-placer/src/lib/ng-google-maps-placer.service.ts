import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material';

import { NgGoogleMapsPlacerComponent } from './ng-google-maps-placer.component';

@Injectable({
  providedIn: 'root'
})
export class NgGoogleMapsPlacerService {

  constructor(private dialog: MatDialog) { }

  openPlacer(): MatDialogRef<NgGoogleMapsPlacerComponent> {
    return this.dialog.open(NgGoogleMapsPlacerComponent, {
      width: '90vw',
      // data: client
    });
  }
}

import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';
import { NgGoogleMapsPlacerComponent } from './ng-google-maps-placer.component';
import { NgGoogleMapsPlacerService } from './ng-google-maps-placer.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatDialogModule
  ],
  declarations: [NgGoogleMapsPlacerComponent],
  entryComponents: [NgGoogleMapsPlacerComponent],
  exports: [NgGoogleMapsPlacerComponent],
  providers: [NgGoogleMapsPlacerService]
})
export class NgGoogleMapsPlacerModule { }

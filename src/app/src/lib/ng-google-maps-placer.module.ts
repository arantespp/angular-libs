import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
} from '@angular/material';
import { FlexModule } from '@angular/flex-layout';
import { NgGoogleMapsPlacerComponent } from './ng-google-maps-placer.component';
import { NgGoogleMapsPlacerService } from './ng-google-maps-placer.service';
import { NgGoogleMapsPlacerConfig } from './ng-google-maps-placer.config';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  declarations: [
    NgGoogleMapsPlacerComponent
  ],
  entryComponents: [
    NgGoogleMapsPlacerComponent
  ],
  exports: [
    NgGoogleMapsPlacerComponent
  ],
})
export class NgGoogleMapsPlacerModule {
  static forRoot(ngGoogleMapsPlacerConfig: NgGoogleMapsPlacerConfig): ModuleWithProviders {
    return {
      ngModule: NgGoogleMapsPlacerModule,
      providers: [
        {
          provide: NgGoogleMapsPlacerConfig,
          useValue: ngGoogleMapsPlacerConfig,
        },
        NgGoogleMapsPlacerService,
      ]
    };
  }
}

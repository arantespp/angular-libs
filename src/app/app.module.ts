import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { NgGoogleMapsLoaderModule } from 'dist/ng-google-maps-loader';
import { NgGoogleMapsPlacerModule } from './src/public_api';

import { config } from './app.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgGoogleMapsLoaderModule.forRoot({
      key: config.MAPS_KEY,
      language: 'pt',
      libraries: ['places', 'geometry'],
    }),
    NgGoogleMapsPlacerModule.forRoot({
      defaultPlace: {
        geometry: {
          location: {
            lat: 23,
            lng: -46,
          }
        }
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

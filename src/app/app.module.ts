import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { NgGoogleMapsLoaderModule } from 'dist/ng-google-maps-loader';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgGoogleMapsLoaderModule.forRoot({
      key: 'AIzaSyCcR0j7GiCnjh7FzIZ7QVeWFzU4pjBKZI4',
      language: 'pt',
      libraries: ['places', 'geometry'],
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { LoadGoogleMapsModule } from 'dist/ng-load-google-maps';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LoadGoogleMapsModule.forRoot({
      apiKey: 'AIzaSyCcR0j7GiCnjh7FzIZ7QVeWFzU4pjBKZI4',
      language: 'pt',
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

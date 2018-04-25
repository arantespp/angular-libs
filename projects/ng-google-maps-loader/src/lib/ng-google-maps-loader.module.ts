import { NgModule, ModuleWithProviders } from '@angular/core';

import { NgGoogleMapsLoaderConfig } from './ng-google-maps-loader.config';
import { NgGoogleMapsLoaderService } from './ng-google-maps-loader.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: []
})
export class NgGoogleMapsLoaderModule {
  static forRoot(ngGoogleMapsLoaderConfig: NgGoogleMapsLoaderConfig): ModuleWithProviders {
    return {
      ngModule: NgGoogleMapsLoaderModule,
      providers: [
        {
          provide: NgGoogleMapsLoaderConfig,
          useValue: ngGoogleMapsLoaderConfig,
        },
        NgGoogleMapsLoaderService,
      ]
    };
  }
}

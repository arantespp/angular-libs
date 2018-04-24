import { NgModule, ModuleWithProviders } from '@angular/core';

import { LoadGoogleMapsConfig } from './load-google-maps.config';
import { LoadGoogleMapsService } from './load-google-maps.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: []
})
export class LoadGoogleMapsModule {
  static forRoot(loadGoogleMapsConfig: LoadGoogleMapsConfig): ModuleWithProviders {
    return {
      ngModule: LoadGoogleMapsModule,
      providers: [
        {
          provide: LoadGoogleMapsConfig,
          useValue: loadGoogleMapsConfig,
        },
        LoadGoogleMapsService,
      ]
    };
  }
}

import { InjectionToken } from '@angular/core';
import { Place } from './place';

export interface NgGoogleMapsPlacerConfig {
  defaultPlace: Place;
}

export const NgGoogleMapsPlacerConfig = new InjectionToken<NgGoogleMapsPlacerConfig>('ng-google-maps-placer-config');

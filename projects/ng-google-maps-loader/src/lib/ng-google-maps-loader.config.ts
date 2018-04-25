import { InjectionToken } from '@angular/core';

export interface NgGoogleMapsLoaderConfig {
  key: string;
  language?: string;
  libraries?: string[];
}

export const NgGoogleMapsLoaderConfig = new InjectionToken<NgGoogleMapsLoaderConfig>('ng google maps loader config');

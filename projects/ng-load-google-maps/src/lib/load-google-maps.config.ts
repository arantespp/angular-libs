import { InjectionToken } from '@angular/core';

export interface LoadGoogleMapsConfig {
  apiKey: string;
  language?: string;
}

export const LoadGoogleMapsConfig = new InjectionToken<LoadGoogleMapsConfig>('load google maps config');

import {} from '@types/googlemaps';

export interface AddressComponent {
  longName: string;
  shortName: string;
  types: string[];
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Geometry {
  location: LatLng;
}

export interface Place {
  // from Google
  addressComponents?: AddressComponent[];
  formattedAddress?: string;
  geometry: Geometry;
  partialMatch?: boolean;
  placeId?: string;
  postcodeLocalities?: string[];
  types?: string[];
  // properties added
  icon?: string;
}

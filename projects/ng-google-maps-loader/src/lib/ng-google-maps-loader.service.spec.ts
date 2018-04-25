import { TestBed, inject } from '@angular/core/testing';

import { NgGoogleMapsLoaderService } from './ng-google-maps-loader.service';

describe('NgGoogleMapsLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgGoogleMapsLoaderService]
    });
  });

  it('should be created', inject([NgGoogleMapsLoaderService], (service: NgGoogleMapsLoaderService) => {
    expect(service).toBeTruthy();
  }));
});

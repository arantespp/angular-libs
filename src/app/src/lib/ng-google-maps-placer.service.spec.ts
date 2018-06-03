import { TestBed, inject } from '@angular/core/testing';

import { NgGoogleMapsPlacerService } from './ng-google-maps-placer.service';

describe('NgGoogleMapsPlacerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgGoogleMapsPlacerService]
    });
  });

  it('should be created', inject([NgGoogleMapsPlacerService], (service: NgGoogleMapsPlacerService) => {
    expect(service).toBeTruthy();
  }));
});

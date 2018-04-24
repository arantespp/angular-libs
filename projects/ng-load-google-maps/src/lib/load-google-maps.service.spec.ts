import { TestBed, inject } from '@angular/core/testing';

import { LoadGoogleMapsService } from './load-google-maps.service';

describe('LoadGoogleMapsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadGoogleMapsService]
    });
  });

  it('should be created', inject([LoadGoogleMapsService], (service: LoadGoogleMapsService) => {
    expect(service).toBeTruthy();
  }));
});

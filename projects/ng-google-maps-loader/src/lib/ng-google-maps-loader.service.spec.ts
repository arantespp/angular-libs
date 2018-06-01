import { TestBed, inject } from '@angular/core/testing';
import { RendererFactory2 } from '@angular/core';

import { NgGoogleMapsLoaderModule } from './ng-google-maps-loader.module';
import { NgGoogleMapsLoaderService, LoadStatus } from './ng-google-maps-loader.service';

describe('NgGoogleMapsLoaderService', () => {

  const renderer2Mock = {
    createElement: jasmine.createSpy().and.returnValue({
      setAttribute: () => {},
      appendChild: (a, b) => {},
    })
  };
    // jasmine.createSpyObj('renderer2Mock', [
    // 'destroy',
    // {
    //   'createElement': [
    //     'setAttribute'
    //   ]
    // },
    // 'createComment',
    // 'createText',
    // 'destroyNode',
    // 'appendChild',
    // 'insertBefore',
    // 'removeChild',
    // 'selectRootElement',
    // 'parentNode',
    // 'nextSibling',
    // 'setAttribute',
    // 'removeAttribute',
    // 'addClass',
    // 'removeClass',
    // 'setStyle',
    // 'removeStyle',
    // 'setProperty',
    // 'setValue',
    // 'listen',
  // ]);

  const rootRendererFactory2Mock =  {
    createRenderer: () => {
      console.log('aqui no renderer factory');
      return renderer2Mock;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgGoogleMapsLoaderModule.forRoot({
          key: 'AIzaSyCcR0j7GiCnjh7FzIZ7QVeWFzU4pjBKZI4',
          language: 'pt',
          libraries: ['places', 'geometry'],
        }),
      ],
      providers: [
          {
            provide: RendererFactory2,
            useValue: rootRendererFactory2Mock
          }
      ]
      // providers: [NgGoogleMapsLoaderService]
    });
  });

  it('should be created', inject([NgGoogleMapsLoaderService], (service: NgGoogleMapsLoaderService) => {
    expect(service).toBeTruthy();
  }));

  it('should load', inject([NgGoogleMapsLoaderService], (service: NgGoogleMapsLoaderService) => {
    service.load();
    service.loadStatus.subscribe({
      next: (status: LoadStatus) => {
        if (status === LoadStatus.NotLoaded) {
          // console.log('NotLoaded');
        } else if (status === LoadStatus.Loading) {
          // console.log('Loading');
          // expect(renderer2Mock.createElement).toHaveBeenCalled();
        } else if (status === LoadStatus.Loaded) {
          // console.log('Loaded');
        }
      },
      complete: () => {
        // console.log('complete');
      }
    });
  }));
});

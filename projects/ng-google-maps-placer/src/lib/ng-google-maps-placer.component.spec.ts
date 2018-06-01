import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgGoogleMapsPlacerComponent } from './ng-google-maps-placer.component';

describe('NgGoogleMapsPlacerComponent', () => {
  let component: NgGoogleMapsPlacerComponent;
  let fixture: ComponentFixture<NgGoogleMapsPlacerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgGoogleMapsPlacerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgGoogleMapsPlacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

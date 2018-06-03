import { Component, Inject, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgGoogleMapsPlacerConfig } from './ng-google-maps-placer.config';
import { AddressComponent, Geometry, Place } from './place';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-lib-ng-google-maps-placer',
  template: `
  <div style="height: 100%" fxLayout="column">

    <h3 style="margin-bottom: 5px" fxFlex="0 0 auto" mat-dialog-title>Placer</h3>

    <section
      [formGroup]="placerForm"
      style="width: 100%"
      fxFlex="0 0 auto"
      fxLayout="row"
      fxLayoutAlign="space-between center"
      fxLayoutGap="20px">

      <mat-form-field fxFlex="1 1 auto">
        <input
          matInput
          #addressSearchInput
          formControlName="addressInput"
          type="text"
          placeholder="Endereço">
        <button
          mat-button
          matSuffix mat-icon-button
          (click)="placerForm.patchValue({addressInput: '', numberInput: null})"
          aria-label="Clear">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <mat-form-field fxFlex="0 0 15%">
        <input
          matInput
          #numberSearchInput
          formControlName="numberInput"
          type="number"
          placeholder="Número"
          (keyup.enter)="triggerFromInput()">
        <button
          mat-button
          matSuffix
          (click)="placerForm.patchValue({numberInput: null})"
          mat-icon-button
          aria-label="Clear">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <button
        fxFlex="0 0 auto"
        class="mat-elevation-z1"
        mat-mini-fab
        color="primary"
        (click)="triggerFromInput()">
        <mat-icon>search</mat-icon>
      </button>

    </section>

    <span fxFlex="0 0 auto">Status: <b>{{ status }}</b></span>

    <div #googleMapsCanvas fxFlex="1 1 auto"></div>

    <span fxFlex="0 0 auto">Endereço: <b>{{ place.formattedAddress }}</b></span>

    <div fxFlex="0 0 auto" style="margin-top: 20px" fxLayoutGap="5px">
      <button
        #saveButton
        mat-raised-button
        [mat-dialog-close]="place"
        color="primary"
        [disabled]="onSearch">
        Salvar
      </button>
      <button  mat-raised-button [mat-dialog-close]="initialPlace">Cancelar</button>
    </div>

  </div>
  `,
  styles: []
})
export class NgGoogleMapsPlacerComponent implements OnInit {

  private map: google.maps.Map;
  private marker: google.maps.Marker;
  private infoWindow: google.maps.InfoWindow;
  private autocomplete: google.maps.places.Autocomplete;
  private geocoder: google.maps.Geocoder;

  placerForm: FormGroup;
  onSearch = false;
  status = 'OK';
  initialPlace: Place;

  @ViewChild('googleMapsCanvas') googleMapsCanvas: ElementRef;
  @ViewChild('addressSearchInput') addressSearchInput: ElementRef;
  @ViewChild('numberSearchInput') numberSearchInput: ElementRef;
  @ViewChild('saveButton', { read: ElementRef }) saveButton: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public place: Place,
              private matDialogRef: MatDialogRef<NgGoogleMapsPlacerComponent>,
              private formBuilder: FormBuilder,
              private ngZone: NgZone) { }

  ngOnInit() {
    this.setInitialPlace(this.place);
    this.initPlacerForm();
    this.initMap();
    this.initMarker();
    this.initAutocompleteBox();
    this.initInfoWindow();
    this.initGeocoder();
  }

  /**
   * Init functions
   */
  private initPlacerForm() {
    this.placerForm = this.formBuilder.group({
      addressInput: '',
      numberInput: null
    });
  }

  private initMap() {
    this.map = new google.maps.Map(this.googleMapsCanvas.nativeElement, {
      center: this.placeLatLngToGoogleMapsLatLng(this.place),
      zoom: 15,
      gestureHandling: 'greedy',
      // disableDefaultUI: true,
    });

    this.map.addListener('click', (e) => this.ngZone.run(() => this.triggerFromMap(e.latLng)));
  }

  private initMarker() {
    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      position: this.map.getCenter(),
      visible: true,
    });

    this.marker.addListener('dragend', (e) => this.ngZone.run(() => this.triggerFromMap(e.latLng)));
    this.marker.addListener('click', () => this.setInfoWindowFromPlace());
  }

  private initInfoWindow() {
    this.infoWindow = new google.maps.InfoWindow({
      disableAutoPan: true,
    });
    const content = this.place.formattedAddress;
    if (content) {
      this.infoWindow.open(this.map, this.marker);
      this.infoWindow.setContent(content);
    }
  }

  private initAutocompleteBox() {
    this.focusAddressSearchInput();
    this.autocomplete = new google.maps.places.Autocomplete(this.addressSearchInput.nativeElement);
    this.autocomplete.bindTo('bounds', this.map);
    this.autocomplete.addListener('place_changed', () => this.ngZone.run(() => {
      this.onSearch = true;
      const place = this.autocomplete.getPlace();
      this.setPlace(place);
      this.setFormAddressInput(place);
      this.setMapAfterNewPlace();
      this.focusNumberSearchInput();
      this.onSearch = false;
    }));
  }

  private initGeocoder() {
    this.geocoder = new google.maps.Geocoder();
  }

  /**
   * Trigger functions
   */
  public async triggerFromInput() {
    const { addressInput, numberInput } = this.placerForm.value;
    const address = `${addressInput} ${numberInput}`;
    await this.geocode({ address });
    this.setMapAfterNewPlace();
    this.focusSaveButton();
  }

  private async triggerFromMap(location: google.maps.LatLng) {
    this.setMakerFromLatLng(location);
    await this.geocode({ location });
    this.setMapAfterNewPlace();
    this.resetPlacerForm();
    this.focusSaveButton();
  }

  /**
   * Search functions
   */
  private geocode(request: google.maps.GeocoderRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      this.onSearch = false;
      this.geocoder.geocode(request, (results, status) => {
        this.status = google.maps.GeocoderStatus[status];
        this.onSearch = false;
        if (status === google.maps.GeocoderStatus.OK) {
          this.setPlace(results[0]);
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  /**
   * Class variables setters
   */
  private setInitialPlace(place: Place) {
    this.initialPlace = place;
  }

  private setPlace(place: google.maps.GeocoderResult | google.maps.places.PlaceResult) {
    const addressComponents: AddressComponent[] = place.address_components.map(component => {
      return {
        longName: component.long_name,
        shortName: component.short_name,
        types: component.types,
      };
    });

    const geometry: Geometry = {
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }
    };

    this.place = {
      addressComponents,
      formattedAddress: place.formatted_address,
      geometry,
      placeId: place.place_id,
      types: place.types,
    };
  }

  private setFormAddressInput(place: google.maps.GeocoderResult | google.maps.places.PlaceResult) {
    this.placerForm.patchValue({ addressInput: place.formatted_address });
  }

  /**
   * Map setters
   */
  private setMapAfterNewPlace() {
    this.setMarkerFromPlace();
    this.setInfoWindowFromPlace();
    this.setMapCenterFromPlace();
  }

  private setInfoWindowFromPlace() {
    this.infoWindow.close();
    this.infoWindow.setContent(this.place.formattedAddress);
    this.infoWindow.open(this.map, this.marker);
  }

  private setMakerFromLatLng(latLng: google.maps.LatLng) {
    this.infoWindow.close();
    this.marker.setPosition(latLng);
  }

  private setMarkerFromPlace() {
    this.infoWindow.close();
    this.marker.setPosition(this.placeLatLngToGoogleMapsLatLng(this.place));
  }

  private setMapCenterFromPlace() {
    this.map.setCenter(this.placeLatLngToGoogleMapsLatLng(this.place));
  }

  /**
   * Helper functions
   */
  private placeLatLngToGoogleMapsLatLng(place: Place): google.maps.LatLng {
    return new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng);
  }

  private resetPlacerForm() {
    this.placerForm.reset();
  }

  private focusAddressSearchInput() {
    this.addressSearchInput.nativeElement.focus();
  }

  private focusNumberSearchInput() {
    this.numberSearchInput.nativeElement.focus();
  }

  private focusSaveButton() {
    this.saveButton.nativeElement.focus();
  }

}

import { Component, Inject, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgGoogleMapsPlacerConfig } from './ng-google-maps-placer.config';
import { AddressComponent, Geometry, Place } from './place';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-lib-ng-google-maps-placer',
  template: `
  <h2 mat-dialog-title>Placer</h2>

  <mat-dialog-content style="height: 100%" fxLayout="column">

    <form
      [formGroup]="loaderForm"
      style="width: 100%"
      fxFlex="0 0 auto"
      fxLayout="row"
      fxLayoutGap="30px">

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
          mat-icon-button
          aria-label="Clear">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <button
        fxFlex="0 0 auto"
        class="mat-elevation-z1"
        mat-mini-fab color="primary"
        (click)="triggerFromInput()">
        <mat-icon>search</mat-icon>
      </button>

    </form>

    <p>Form value: {{ loaderForm.value | json }}</p>
    <p>Form status: {{ loaderForm.status | json }}</p>

    <span fxFlex="0 0 auto">Status: <b>{{ status }}</b></span>

    <div #googleMapsCanvas fxFlex="1 1 auto"></div>

  </mat-dialog-content>

  <mat-dialog-actions>
    <!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->
    <button #saveButton mat-raised-button (click)="save()" [disabled]="onSearch">Salvar</button>
    <button mat-raised-button mat-dialog-close>Cancelar</button>
  </mat-dialog-actions>
  `,
  styles: []
})
export class NgGoogleMapsPlacerComponent implements OnInit {

  public loaderForm: FormGroup;

  private map: google.maps.Map;
  private marker: google.maps.Marker;
  private infoWindow: google.maps.InfoWindow;
  private autocomplete: google.maps.places.Autocomplete;
  private geocoder: google.maps.Geocoder;

  onSearch = false;
  status = 'OK';

  @ViewChild('googleMapsCanvas') googleMapsCanvas: ElementRef;
  @ViewChild('addressSearchInput') addressSearchInput: ElementRef;
  @ViewChild('numberSearchInput') numberSearchInput: ElementRef;
  @ViewChild('saveButton', { read: ElementRef }) saveButton: ElementRef;

  constructor(@Inject(NgGoogleMapsPlacerConfig) private ngGoogleMapsPlacerConfig: NgGoogleMapsPlacerConfig,
              @Inject(MAT_DIALOG_DATA) private place: Place,
              private matDialogRef: MatDialogRef<NgGoogleMapsPlacerComponent>,
              private formBuilder: FormBuilder,
              private ngZone: NgZone) { }

  ngOnInit() {
    this.initLoaderForm();
    this.initMap();
    this.initMarker();
    this.initAutocompleteBox();
    this.initInfoWindow();
    this.initGeocoder();
  }

  /**
   * Init functions
   */
  private initLoaderForm() {
    this.loaderForm = this.formBuilder.group({
      addressInput: '',
      numberInput: null
    });
  }

  private initMap() {
    this.map = new google.maps.Map(this.googleMapsCanvas.nativeElement, {
      center: this.placeLatLngToGoogleMapsLatLng(this.place || this.ngGoogleMapsPlacerConfig.defaultPlace),
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
      // icon: {
      //   url: this.location.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(35, 35)
      // },
    });

    this.marker.addListener('dragend', (e) => this.ngZone.run(() => this.triggerFromMap(e.latLng)));
  }

  private initInfoWindow() {
    this.infoWindow = new google.maps.InfoWindow({
      disableAutoPan: true,
    });
    const content = this.place ? this.place.formattedAddress : this.ngGoogleMapsPlacerConfig.defaultPlace.formattedAddress;
    if (content) {
      this.infoWindow.open(this.map, this.marker);
      this.infoWindow.setContent(content);
    }
  }

  private initAutocompleteBox() {
    // this.addressSearchInput.nativeElement.focus();
    this.autocomplete = new google.maps.places.Autocomplete(this.addressSearchInput.nativeElement);
    this.autocomplete.bindTo('bounds', this.map);
    this.autocomplete.addListener('place_changed', () => this.ngZone.run(() => {
      this.onSearch = true;
      const place = this.autocomplete.getPlace();
      this.setPlace(place);
      // this.setFormAddressInput(place);
      this.setMapAfterNewPlace();
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
    const { addressInput, numberInput } = this.loaderForm.value;
    const address = `${addressInput} ${numberInput}`;
    await this.geocode({ address });
    console.log('auiasdasd');
    this.setMapAfterNewPlace();
  }

  private async triggerFromMap(location: google.maps.LatLng) {
    this.setMakerFromLatLng(location);
    await this.geocode({ location });
    this.setMapAfterNewPlace();
  }

  /**
   * Search functions
   */
  private geocode(request: google.maps.GeocoderRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      this.onSearch = true;
      this.geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.setPlace(results[0]);
          resolve();
        } else {
          reject();
        }
        this.status = google.maps.GeocoderStatus[status];
        this.onSearch = false;
      });
    });
  }

  /**
   * Class variables setters
   */
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
    this.loaderForm.patchValue({ addressInput: place.formatted_address });
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
    return new google.maps.LatLng(
      place.geometry.location.lat,
      place.geometry.location.lng
    );
  }

  save() {
    this.matDialogRef.close(this.place);
  }

}

// private hasPlaceStreetNumber(place: Place): boolean {
//   let _hasStreetNumber = false;
//   this.place.addressComponents.forEach(addressComponent => {
//     if (!!addressComponent.types.find(type => type === 'street_number')) {
//       _hasStreetNumber = true;
//     }
//   });
//   return _hasStreetNumber;
// }

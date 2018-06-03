import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgGoogleMapsPlacerConfig } from './ng-google-maps-placer.config';
import { AddressComponent, Geometry, Place } from './place';
import { } from '@types/googlemaps';

@Component({
  selector: 'lib-ng-google-maps-placer',
  template: `
  <h2 mat-dialog-title>Placer</h2>

  <mat-dialog-content style="height: 100%" fxLayout="column">

    <div style="width: 100%" fxFlex="0 0 auto" fxLayout="row" fxLayoutGap="30px">

      <mat-form-field fxFlex="1 1 auto">
        <input
          matInput
          #addressSearchInput
          type="text"
          placeholder="Endereço"
          [(ngModel)]="addressSearchInputValue">
        <button
          mat-button
          *ngIf="addressSearchInputValue"
          matSuffix mat-icon-button
          aria-label="Clear"
          (click)="addressSearchInputValue=''; numberSearchInputValue=null">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <mat-form-field fxFlex="0 0 20%">
        <input
          matInput
          #numberSearchInput
          type="number"
          placeholder="Número"
          (keyup.enter)="numberSearch()"
          [(ngModel)]="numberSearchInputValue">
        <button
          mat-button
          *ngIf="numberSearchInputValue"
          matSuffix
          mat-icon-button
          aria-label="Clear"
          (click)="numberSearchInputValue=null">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <button
        fxFlex="0 0 auto"
        class="mat-elevation-z1"
        mat-mini-fab color="primary"
        (click)="numberSearch()">
        <mat-icon>search</mat-icon>
      </button>

    </div>

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

  private map: google.maps.Map;
  private marker: google.maps.Marker;
  private infoWindow: google.maps.InfoWindow;
  private autocomplete: google.maps.places.Autocomplete;
  private geocoder: google.maps.Geocoder;

  private place: Place;

  onSearch = false;
  status = 'OK';
  addressSearchInputValue: string;
  numberSearchInputValue: number;

  @ViewChild('googleMapsCanvas') googleMapsCanvas: ElementRef;
  @ViewChild('addressSearchInput') addressSearchInput: ElementRef;
  @ViewChild('numberSearchInput') numberSearchInput: ElementRef;
  @ViewChild('saveButton', { read: ElementRef }) saveButton: ElementRef;

  constructor(@Inject(NgGoogleMapsPlacerConfig) private ngGoogleMapsPlacerConfig: NgGoogleMapsPlacerConfig,
              @Inject(MAT_DIALOG_DATA) private inputPlace: Place,
              private matDialogRef: MatDialogRef<NgGoogleMapsPlacerComponent>) { }

  ngOnInit() {
    this.initMap();
    this.initMarker();
    this.initAutocompleteBox();
    this.initInfoWindow();
    this.initGeocoder();
  }

  initMap() {
    this.map = new google.maps.Map(this.googleMapsCanvas.nativeElement, {
      center: this.placeLatLngToGoogleMapsLatLng(this.ngGoogleMapsPlacerConfig.defaultPlace),
      zoom: 15,
      gestureHandling: 'greedy',
      // disableDefaultUI: true,
    });

    this.map.addListener('click', (e) => this.setMaker(e.latLng));
  }

  initMarker() {
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

    this.marker.addListener('dragend', (e) => this.setMaker(e.latLng));
  }

  initInfoWindow() {
    this.infoWindow = new google.maps.InfoWindow({
      disableAutoPan: true,
    });
    const content = this.inputPlace ? this.inputPlace.formattedAddress : this.ngGoogleMapsPlacerConfig.defaultPlace.formattedAddress;
    if (content) {
      this.infoWindow.open(this.map, this.marker);
      this.infoWindow.setContent(content);
    }
  }

  initAutocompleteBox() {
    this.addressSearchInput.nativeElement.focus();

    this.autocomplete = new google.maps.places.Autocomplete(this.addressSearchInput.nativeElement);
    this.autocomplete.bindTo('bounds', this.map);

    this.autocomplete.addListener('place_changed', () => {
      this.onSearch = true;
      this.numberSearchInputValue = null;
      const place = this.autocomplete.getPlace();
      this.setPlace(place);
      this.openInfoWindow();
      this.marker.setPosition(this.placeLatLngToGoogleMapsLatLng(this.place));
      this.map.setCenter(this.placeLatLngToGoogleMapsLatLng(this.place));
      // this.numberSearchInput.nativeElement.focus();
      this.onSearch = false;
    });
  }

  initGeocoder() {
    this.geocoder = new google.maps.Geocoder();
  }

  private setMaker(latLng: google.maps.LatLng) {
    this.marker.setPosition(latLng);
    this.infoWindow.close();
    this.onSearch = true;

    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this.setPlace(results[0]);
          this.openInfoWindow();
          this.onSearch = false;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
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
      // partialMatch: place.partial_match,
      placeId: place.place_id,
      // postcodeLocalities: place.postcode_localities,
      types: place.types,
    };
  }

  private openInfoWindow() {
    this.infoWindow.setContent(this.place.formattedAddress);
    this.infoWindow.open(this.map, this.marker);
  }

  private placeLatLngToGoogleMapsLatLng(place: Place): google.maps.LatLng {
    return new google.maps.LatLng(
      place.geometry.location.lat,
      place.geometry.location.lng
    );
  }

  numberSearch(): Promise<Place> {
    return new Promise((resolve, reject) => {
      this.onSearch = true;
      const place = this.autocomplete.getPlace();
      const formattedAddress = place ? place.formatted_address : this.addressSearchInputValue;

      if (formattedAddress) {
        this.geocoder.geocode({
          address: `${formattedAddress} ${this.numberSearchInputValue}`,
        }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              this.setPlace(results[0]);
              this.openInfoWindow();
              this.onSearch = false;
              this.saveButton.nativeElement.focus();
              this.status = this.numberSearchInputValue && !this.hasPlaceStreetNumber(this.place) ?
                'NÚMERO NÃO REGISTRADO NESTE ENDEREÇO' : 'OK';
              resolve(this.place);
            }
          } else {
            if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
              this.status = 'ENDEREÇO NÃO ENCONTRADO';
            }
            reject(status);
          }
        });
      } else {
        resolve(this.place);
      }

    }); // promise
  }

  private hasPlaceStreetNumber(place: Place): boolean {
    let _hasStreetNumber = false;
    this.place.addressComponents.forEach(addressComponent => {
      if (!!addressComponent.types.find(type => type === 'street_number')) {
        _hasStreetNumber = true;
      }
    });
    return _hasStreetNumber;
  }

  save() {
    this.matDialogRef.close(this.place);
  }

}

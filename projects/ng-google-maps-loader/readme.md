# Load Google Maps API in the Angular way

# Example

    ...

    import { NgGoogleMapsLoaderModule, NgGoogleMapsLoaderService } from 'ng-google-maps-loader';

    @NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        NgGoogleMapsLoaderModule.forRoot({
            key: YOUR_API_KEY',
            language: 'pt',
            libraries: ['places', 'geometry'],
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
    })
    export class AppModule {
        constructor(ngGoogleMapsLoaderService: NgGoogleMapsLoaderService) {
            ngGoogleMapsLoaderService.load();
        }
    }

# not finished

# TODO
tests
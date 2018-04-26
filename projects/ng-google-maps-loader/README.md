# Load Google Maps API in the Angular way

This code loads Google Maps API asynchronously without touching the DOM directly.

# Example

## Importing the module

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

`NgGoogleMapsLoaderService` was already provided at `NgGoogleMapsLoaderModule`.

## Checking if the script was loaded

    ...

    import { NgGoogleMapsLoaderService, LoadStatus } from 'ng-google-maps-loader';

    @Component({
        ...
    })
    export class MapsComponent implements OnInit {
        constructor(private ngGoogleMapsLoaderService: NgGoogleMapsLoaderService) { }

        ngOnInit() {
            this.ngGoogleMapsLoaderService.loadStatus.subscribe({
                next: (status: LoadStatusEnum) => {
                    if (status === LoadStatus.NotLoaded) {
                        // do something when function load() was not called yet.
                    } else (status === LoadStatus.Loading) {
                        // do something when function load() was called but the script was not finished.
                    } else (status === LoadStatus.Loaded} {
                        // do something when the API was loaded/finished.
                    }
                },
                complete: () => {
                    // do something when the API was loaded.
                }
            });
        }

    }

# TODO

tests

# Notes

This was my first project published at NPM and my first contribution to open source. Feel free to contact me if there is some bug or some code improve, I'd appreciate a lot your help. My email: arantespp@gmail.com.
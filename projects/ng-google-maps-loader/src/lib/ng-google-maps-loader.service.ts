import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { BehaviorSubject, Observable } from 'rxjs';

import { NgGoogleMapsLoaderConfig } from './ng-google-maps-loader.config';

export enum LoadStatus { NotLoaded, Loading, Loaded }

@Injectable({
  providedIn: 'root'
})
export class NgGoogleMapsLoaderService {

  private _loadStatusSubject = new BehaviorSubject<LoadStatus>(LoadStatus.NotLoaded);
  private _loadScript: any;
  private _loadScriptId = 'ng-google-maps-loader-script-id';
  private _renderer2: Renderer2;

  constructor(@Inject(DOCUMENT) private document: any,
              @Inject(NgGoogleMapsLoaderConfig) private ngGoogleMapsLoaderConfig: NgGoogleMapsLoaderConfig,
              rendererFactory: RendererFactory2) {
    this._renderer2 = rendererFactory.createRenderer(null, null);
  }

  get loadScipt(): any {
    return this._loadScript;
  }

  get loadSciptId(): string {
    return this._loadScriptId;
  }

  get loadStatus(): Observable<LoadStatus> {
    return this._loadStatusSubject as Observable<LoadStatus>;
  }

  public load() {
    if (this.document.getElementById(this._loadScriptId)) {
      return;
    }
    this._loadStatusSubject.next(LoadStatus.Loading);
    const googleMapsApiUrl = this.createGoogleMapsApiUrl();
    this._loadScript = this.createLoadScript(googleMapsApiUrl);
    this._renderer2.appendChild(this.document.body, this._loadScript);
  }

  private createGoogleMapsApiUrl(): string {
    return [
      'https://maps.googleapis.com/maps/api/js',
      `?key=${this.ngGoogleMapsLoaderConfig.key}`,
      `&libraries=${this.ngGoogleMapsLoaderConfig.libraries.join(',')}`,
      `&language=${this.ngGoogleMapsLoaderConfig.language || 'en'}`,
    ].join('');
  }

  private createLoadScript(googleMapsApiUrl: string): any {
    const script = this._renderer2.createElement('script');

    script.setAttribute('defer', '');
    script.setAttribute('async', '');
    script.type = 'text/javascript';
    script.id = this._loadScriptId;
    script.src = googleMapsApiUrl;
    script.onload = this.scriptOnLoad.bind(this);

    return script;
  }

  private scriptOnLoad() {
    this._loadStatusSubject.next(LoadStatus.Loaded);
    this._loadStatusSubject.complete();
  }
}

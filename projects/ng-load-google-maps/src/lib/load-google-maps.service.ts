import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { BehaviorSubject, Observable } from 'rxjs';

import { LoadGoogleMapsConfig } from './load-google-maps.config';

export enum LoadStatusEnum { NotLoaded, Loading, Loaded }

@Injectable({
  providedIn: 'root'
})
export class LoadGoogleMapsService {

  private _loadStatusSubject = new BehaviorSubject<LoadStatusEnum>(LoadStatusEnum.NotLoaded);
  private _loadScript: any;
  private _loadScriptId = 'load-google-maps-script-id';
  private _renderer2: Renderer2;

  constructor(@Inject(DOCUMENT) private document: any,
              @Inject(LoadGoogleMapsConfig) private loadGoogleMapsConfig: LoadGoogleMapsConfig,
              rendererFactory: RendererFactory2) {
    this._renderer2 = rendererFactory.createRenderer(null, null);
  }

  get loadScipt(): any {
    return this._loadScript;
  }

  get loadSciptId(): string {
    return this._loadScriptId;
  }

  get loadStatus(): Observable<LoadStatusEnum> {
    return this._loadStatusSubject as Observable<LoadStatusEnum>;
  }

  public load() {
    if (this.document.getElementById(this._loadScriptId)) {
      return;
    }
    this._loadStatusSubject.next(LoadStatusEnum.Loading);
    const googleMapsApiUrl = this.createGoogleMapsApiUrl();
    this._loadScript = this.createLoadScript(googleMapsApiUrl);
    this._renderer2.appendChild(this.document.body, this._loadScript);
  }

  private createGoogleMapsApiUrl(): string {
    return [
      'https://maps.googleapis.com/maps/api/js',
      `?key=${this.loadGoogleMapsConfig.apiKey}`,
      '&libraries=places',
      `&language=${this.loadGoogleMapsConfig.language || 'en'}`,
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
    this._loadStatusSubject.next(LoadStatusEnum.Loaded);
    this._loadStatusSubject.complete();
  }
}

import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import devConfig from '@assets/configs/appsettings.dev.json';
import prodConfig from '@assets/configs/appsettings.json';
import { Observable } from 'rxjs';
const config = environment.production ? prodConfig : devConfig;

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private siteCode: string = '';
  constructor() {
    this.siteCode = (config as any)['SITE_CODE'];
  }

  public get SiteCode() {
    return this.siteCode;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable()
export class ConfigLoaderService {

  public appTitle = 'Not Set Yet';
  public appConfig: any;

  constructor(private httpClient: HttpClient) { }

  initialize() {
    let configUrlPath = '';
    const baseUrl = document.location.pathname.split('/')[1];
    const configUrlFileName = environment.production ? 'appsettings.json' : 'appsettings.dev.json';

    if (baseUrl === '') {
      configUrlPath = `/assets/configs/${configUrlFileName}`;
    } else {
      configUrlPath = `/${baseUrl}/assets/configs/${configUrlFileName}`;
    }

    // console.log('::config path:: ', configUrlPath);
    return this.httpClient.get(configUrlPath)
      .pipe(tap((response: any) => {
        this.appConfig = response;
        this.appTitle = response.title;
      })).toPromise<any>();
  }

}

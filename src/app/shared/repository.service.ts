import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { ConfigService } from '@app/app-core/config.service';
// import config from '@assets/configs/appsettings.json'

// declare function require(name: string);
// const settingsFileName = environment.production ? 'appsettings.prod.json' : 'appsettings.json';
// const appSettings = require(`../../../../assets/configs/${settingsFileName}`);
import devConfig from '../../assets/configs/appsettings.dev.json';
import prodConfig from '../../assets/configs/appsettings.json';
import { Observable } from 'rxjs';
const config = environment.production ? prodConfig : devConfig;

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private _apiUri: string = '';

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    // var c = (<any>config)['api_endpoints']['api_uri'];
    // console.log('config >> ', c);
    // console.log('configService.getApi() >> ', configService.getApi('API_URI'));

    this._apiUri = (config as any)['API_ENDPOINTS']['API_URI'];
    // console.log('config api >> ', this._apiUri);

  }

  private httpHeaderOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
      // .append('Authorization', `Bearer ${this.accessToken}`)
      .append('Accept', '*/*')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Methods', '*'),
    body: ''
  };

  public query = (route: string, query: string) => {
    return this.http.post(this.createCompleteRoute(route, this._apiUri), query);
  }

  public getData = (route: string) => {
    return this.http.get(this.createCompleteRoute(route, this._apiUri));
  }

  public getDataParm = (route: string, body: any): any => {
    // return this.http.post(this.createCompleteRoute(route, this._apiUri), body, this.generateHeaders());
    return this.http.post(this.createCompleteRoute(route, this._apiUri), body, this.httpHeaderOptions);
  }

  public create = (route: string, body: any) => {
    // console.log('data >> ', body);
    // console.log('this.createCompleteRoute(route, this._apiUri) ', this.createCompleteRoute(route, this._apiUri));
    return this.http.post(this.createCompleteRoute(route, this._apiUri), body, this.httpHeaderOptions);
  }

  public save = (route: string, body: any) => {
    return this.http.post(this.createCompleteRoute(route, this._apiUri), body, this.httpHeaderOptions);
  }

  public update = (route: string, body: any) => {
    return this.http.post(this.createCompleteRoute(route, this._apiUri), body, this.httpHeaderOptions);
  }

  public post = (route: string, body: any, options: any): any => {
    return this.http.post(this.createCompleteRoute(route, this._apiUri), body, options);
  }

  // public delete = (route: string) => {
  //   return this.http.delete(this.createCompleteRoute(route, this._apiUri));
  // }

  public delete = (route: string, body: any) => {
    const options = this.httpHeaderOptions;
    options.body = body;

    return this.http.post(this.createCompleteRoute(route, this._apiUri), body, options);
    // return this.http.delete(this.createCompleteRoute(route, this._apiUri), options);
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    if (envAddress === '') {
      return route;
    }

    const last = envAddress.slice(-1);
    if (last !== '/') {
      envAddress += '/';
    }
    return `${envAddress}${route}`;

  }

  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }

  getFile(url: string): Observable<any> {
    // return this.http.get<File>(url, { responseType: "text" });
    return this.http.get('assets/test.txt', { responseType: 'text' });
  }

  queries(data: any): Observable<any> {
    //console.log('testController Is Not Empty => ', this.http.post('api/ExecQuery/exec', data));
    return this.getDataParm('api/ExecQuery/exec', data);
  }

}

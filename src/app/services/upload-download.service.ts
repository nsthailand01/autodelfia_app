import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse, HttpParams } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { environment } from './../../environments/environment';

import devConfig from '../../assets/configs/appsettings.dev.json';
import prodConfig from '../../assets/configs/appsettings.json';
import { FormGroup } from '@angular/forms';

const config = environment.production ? prodConfig : devConfig;

@Injectable()
export class UploadDownloadService {
  private baseApiUrl: string;
  private apiDownloadUrl: string;
  private apiUploadUrl: string;
  private apiFileUrl: string;
  private _apiUri: string = '';

  constructor(private httpClient: HttpClient) {
    this.baseApiUrl = ''; // 'http://localhost:5001/api/';
    this.apiDownloadUrl = this.baseApiUrl + 'api/filesmanager/download';
    this.apiUploadUrl = this.baseApiUrl + 'api/filesmanager/upload';
    this.apiFileUrl = this.baseApiUrl + 'files';

    this._apiUri = (config as any)['API_ENDPOINTS']['API_URI'];
    // console.log('api >> ', this._apiUri);
  }

  public downloadFile(file: string, filePath: string, templateType: string): Observable<HttpEvent<Blob>> {
    const parameter = new HttpParams()
      .set('fileName', file)
      .set('filePath', filePath)
      .set('templateType', '');

    return this.httpClient.request(new HttpRequest(
      'GET',
      `${this.createCompleteRoute(this.apiDownloadUrl, this._apiUri)}?${parameter.toString()}`,
      null,
      {
        reportProgress: true,
        responseType: 'blob'
      }));
  }

  public downloadAmnioticFile(file: string): Observable<HttpEvent<Blob>> {
    console.log('request......');
    const parameter = new HttpParams()
      .set('fileName', file)
      .set('templateType', '');

    return this.httpClient.request(new HttpRequest(
      'GET',
      `${this.createCompleteRoute(this.apiDownloadUrl + '/amniotic', this._apiUri)}?${parameter.toString()}`,
      null,
      {
        reportProgress: true,
        responseType: 'blob'
      }));
  }

  public uploadAmnioticFile(file: Blob, requestsForm: FormGroup): Observable<HttpEvent<void>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('latestFilename', requestsForm.get('amnioticPhysicalLatestFileName').value);
    formData.append('physicalFileName', requestsForm.get('amnioticPhysicalFileName').value);

    return this.httpClient.request(new HttpRequest(
      'POST',
      this.createCompleteRoute(this.apiUploadUrl + '/amniotic', this._apiUri),
      formData,
      {
        reportProgress: true
      }));
  }

  public uploadFile(file: Blob): Observable<HttpEvent<void>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.request(new HttpRequest(
      'POST',
      // this.apiUploadUrl,
      this.createCompleteRoute(this.apiUploadUrl, this._apiUri),
      formData,
      {
        reportProgress: true
      }));
  }

  public getFiles(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.createCompleteRoute(this.apiFileUrl, this._apiUri));
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    if (envAddress === '') {
      return route;
    }

    const last = envAddress.slice(-1);
    if (last !== '/') {
      envAddress += '/';
    }
    // console.log('route >> ', `${envAddress}${route}`);
    return `${envAddress}${route}`;

  }
}

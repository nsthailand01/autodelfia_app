import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../../assets/configs/appsettings.json';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

  constructor(
    // @Inject('APP_BASE_HREF') private baseUrl: string
  ) {
    // console.log('APP_BASE_HREF >> ', this.baseUrl);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const url = config.API_ENDPOINTS.API_URI; // environment.apiUrl;
    console.log('interceptor api url >> ', url);
    request = request.clone({
      url: url + request.url
    });

    return next.handle(request);
  }
}

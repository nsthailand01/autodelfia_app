import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import devConfig from '../../assets/configs/appsettings.dev.json';
import prodConfig from '../../assets/configs/appsettings.json';
import { Security_UsersModel } from '@app/models';
import { ConfigService } from '@app/app-core/config.service';

const config = environment.production ? prodConfig : devConfig;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<Security_UsersModel>;
  public currentUser: Observable<Security_UsersModel>;
  private _apiUri: string = '';
  storageName = 'currentUserDown';

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    // this.currentUserSubject = new BehaviorSubject<Security_UsersModel>(JSON.parse(localStorage.getItem(this.storageName)));
    this.currentUserSubject = new BehaviorSubject<Security_UsersModel>(JSON.parse(sessionStorage.getItem(this.storageName)));
    this.currentUser = this.currentUserSubject.asObservable();

    // console.log('config load >> ', config);
    this._apiUri = (config as any)['API_ENDPOINTS']['API_URI'];
    // console.log('config api >> ', this._apiUri);

    // var api = this.configService.getApiUri();
    // console.log('api uri >> ', api);

    // this.configService.getSettings().subscribe(data => {
    //   console.log('config service setting >> ', data.apiUrl);
    // })
  }

  public get currentUserValue(): Security_UsersModel {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(this.createCompleteRoute('api/auth/signin', this._apiUri), { username, UserPassword: password })
      .pipe(
        map(user => {
          user.authdata = window.btoa(username + ':' + password);
          // localStorage.setItem(this.localStorageName, JSON.stringify(user));
          sessionStorage.setItem(this.storageName, JSON.stringify(user));
          localStorage.setItem('latestUsernameDown', username);
          this.currentUserSubject.next(user);
          return user;
        }));
  }

  logout() {
    this.currentUserSubject?.next(null);
    // localStorage.removeItem(this.storageName);
    sessionStorage.removeItem(this.storageName);
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

  get isLoggedIn(): boolean {
    const authToken = this.currentUserValue?.accessToken;
    return (authToken !== null) ? true : false;
  }

}

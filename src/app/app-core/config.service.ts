import { Injectable, APP_INITIALIZER } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig } from './app-config';
declare var fs: any;

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: object;
  private env: string;
  private settingsFileName: string;

  constructor(private http: HttpClient) {
    this.settingsFileName = environment.production ? 'appsettings.json' : 'appsettings.dev.json';
  }

  getSettings(): Observable<AppConfig> {
    const settings = new AppConfig();
    return of<AppConfig>(settings);
  }

  load(url: string) {
    return new Promise<void>((resolve) => {
      this.http.get(url)
        .pipe(map((res: any) => res.json()))
        .subscribe(config => {
          this.config = config;
          resolve();
        });
    });
  }

  public doLoad(): Promise<any> {
    return new Promise((resolve) => {
      this.http.get('./assets/configs/' + this.settingsFileName)
        .subscribe((data) => {
          console.log('data >> ', data);
          this.config = data;
          resolve(true);
        },
          (error: any) => {
            console.error('error >> ', error);
            //return Observable.(error.json().error || 'Server error');
          });
    });
  }

  public readConfig() {
    this.http.get('./assets/configs/' + this.settingsFileName)
      .subscribe(data => {
        console.log('data >> ', data);
        console.log('data2 >> ', data['API_ENDPOINTS']['API_URI']);
      },
        err => {
        });
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
    };
    reader.readAsText(file);
  }

  isDevmode() {
    return this.env === 'development';
  }

  getApi(key: string): string {
    return this.config['API_ENDPOINTS'][key];
  }

  getApiUri(): string {
    let uri = this.config['API_ENDPOINTS']['API_URI'];
    const last = uri.slice(-1);
    if (last !== '/') { uri += '/'; }
    return uri;
  }

  getApiXKey(): string {
    const uri = this.config['API_ENDPOINTS']['X_API_KEY'];
    return uri;
  }

  getApiVersion(): string {
    let uri: string = this.config['API_ENDPOINTS']['API_VERSION'];
    const last = uri.slice(-1);
    if (last !== '/') { uri += '/'; }
    return uri;
  }

  getAccessToken(): string {
    const currentUser = localStorage.getItem('currentUser');
    const obj = JSON.parse(currentUser) as string;
    return obj;
  }

  get(key: any) {
    return this.config[key];
  }
}

export function ConfigServiceFactory(appConfig: ConfigService): () => Promise<any> {
  return () => appConfig.doLoad();
}

export function initializeApp() {
  return {
    provide: APP_INITIALIZER,
    useFactory: ConfigServiceFactory,
    deps: [ConfigService],
    multi: true
  };
}

const ConfigModule = {
  init: initializeApp
};

export { ConfigModule };

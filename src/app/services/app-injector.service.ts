import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppInjectorService {
  private static _injector: Injector;

  static setInjector(injector: Injector) {
    this._injector = injector;
  }

  static getInjector(): Injector {
    return this._injector;
  }
}

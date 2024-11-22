import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppheaderComponent } from './components/appheader/appheader.component';
import { AppfooterComponent } from './components/appfooter/appfooter.component';
import { AppmenuComponent } from './components/appmenu/appmenu.component';
import { AppsettingComponent } from './components/appsetting/appsetting.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { NoLayoutComponent } from './layout/no-layout/no-layout.component';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy, PathLocationStrategy, DatePipe } from '@angular/common';
import { SnotifyModule, ToastDefaults, SnotifyService } from 'ng-snotify';
import { MySnotifyConfig } from './services/my-snotify.config';
import { PageNotfoundComponent } from './components/page-notfound/page-notfound.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// for HttpClient import:
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './helpers/jwt.interceptor';
// import { UploadComponent } from './components/upload/upload.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { ServerErrorComponent } from './error-pages/server-error/server-error.component';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { ConfigService } from './app-core/config.service';
import { DashboardExComponent } from './screens/dashboard-ex/dashboard-ex.component';
import { DynamicFormsComponent } from './screens/dynamic-forms/dynamic-forms.component';
import { BaseComponent } from './app-core/components/base/base.component';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { CaptureCameraComponent } from './screens/capture-camera/capture-camera.component';
import { GenerateBarcodeExComponent } from './screens/generate-barcode-ex/generate-barcode-ex.component';
import { CanDeactivateGuard } from './helpers/can-deactivate.guard';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from './services/date.adapter';
// import { NgxSplitModule } from 'ngx-split';

// import { InputClearDirective } from './directives/input-clear.directive';
// import { NgxPrintModule } from 'ngx-printx';
import { UploadDownloadService } from './services/upload-download.service';
import { MarkAsteriskDirectiveModule } from './directives/mark-asterisk.directive';
import { initConfig, RuntimeConfigLoaderModule, RuntimeConfigLoaderService } from 'runtime-config-loader';
import { environment } from '@environments/environment';

import {
  AmphurPickComponent,
  DistrictPickComponent,
  EmployeePickerComponent,
  LabnumberPickerComponent,
  LabtestPickerComponent,
  MslabProfilePickerComponent,
  MssitePickerComponent,
  PickerBaseComponent,
  ProvincePickComponent,
  SampleTypePickerComponent,
  SentSamplehdPickerComponent,
  TemplatePickerComponent
} from '@app/pickers';
import { PositionPickComponent } from './pickers/position-pick/position-pick.component';
import { AngularSplitModule } from 'angular-split';
import { ConfigLoaderService } from './services/config-loader/config-loader.service';
import { PreloadFactory } from './services/config-loader/preload-service.factory';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { AutoLogoutService } from './services/auto-logout.service';
//import { DmsinvoiceListComponent } from './screens/dmsinvoice/dmsinvoice-list/dmsinvoice-list.component';
import { DmsinvoiceRoutingModule } from 'src/app/screens/dmsinvoice/dmsinvoice-routing.module';
import { DmsreceiveRoutingModule } from 'src/app/screens/dmsreceive/dmsreceive-routing.module';
//import { DmsreceiveListComponent } from './screens/dmsreceive/dmsreceive-list/dmsreceive-list.component';





declare module "@angular/core" {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    //providers?: Provider[];
  }
}


@NgModule({
  declarations: [
    AppComponent,
    AppheaderComponent,
    AppfooterComponent,
    AppmenuComponent,
    AppsettingComponent,
    DashboardComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    NoLayoutComponent,
    PageNotfoundComponent,
    NotFoundComponent,
    ServerErrorComponent,
    DashboardExComponent,
    DynamicFormsComponent,
    BaseComponent,
    CaptureCameraComponent,
    GenerateBarcodeExComponent,
    // MarkAsteriskDirective,
    // Pickers
    EmployeePickerComponent,
    LabtestPickerComponent,
    MslabProfilePickerComponent,
    MssitePickerComponent,
    AmphurPickComponent,
    DistrictPickComponent,
    ProvincePickComponent,
    LabnumberPickerComponent,

    PickerBaseComponent,
    SampleTypePickerComponent,
    SentSamplehdPickerComponent,
    TemplatePickerComponent,
    PositionPickComponent,
    FormatTimePipe,
    //DmsreceiveListComponent,
    //DmsinvoiceListComponent,
    //GetSampleBarcodeComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    SnotifyModule.forRoot(),
    BrowserAnimationsModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    SharedModule.forRoot(),
    NgxScrollTopModule,
    AngularSplitModule,
    // NgxSplitModule.forRoot(),
    // NgxPrintModule,
    DmsinvoiceRoutingModule,
    DmsreceiveRoutingModule,
    MarkAsteriskDirectiveModule,
    RuntimeConfigLoaderModule.forRoot({
      configUrl: environment.runtimeConfigUrl
    })
  ],
  exports: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    AutoLogoutService,
    DatePipe,
    ConfigService,
    ConfigLoaderService,
    {
      provide: APP_INITIALIZER,
      deps: [
        ConfigLoaderService
      ],
      multi: true,
      useFactory: PreloadFactory
    },
    // { provide: APP_INITIALIZER, useFactory: ConfigLoader, deps: [ConfigService], multi: true },
    { provide: APP_BASE_HREF, useValue: window['_app_base'] || '/' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: 'SnotifyToastConfig', useValue: MySnotifyConfig },
    { provide: MAT_DATE_LOCALE, useValue: 'th' },
    // { provide: LOCALE_ID, useValue: "th-TH" },
    SnotifyService,
    CanDeactivateGuard,
    UploadDownloadService,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [RuntimeConfigLoaderService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// export function ConfigLoader(configService: ConfigService) {
//   return () => configService.load(environment.apiPath);
// }

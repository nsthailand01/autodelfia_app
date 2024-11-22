import { DxReportViewerModule } from 'devexpress-reporting-angular';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { InputClearDirective } from '@app/directives/input-clear.directive';
import { MaterialModule } from '@app/material/material.module';
import { LocalDatetimePipe } from '@app/pipes/local-datetime.pipe';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { provideSwal } from '../services/index';
import { BreadcrumbNavigatorComponent } from './breadcrumb-navigator/breadcrumb-navigator.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from './dialogs/success-dialog/success-dialog.component';
import { AngularSplitModule } from 'angular-split';
import { PatientInfoModalModule } from '@app/screens/patient-info-modal/patient-info-modal.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { UploadComponent } from '@app/components/upload/upload.component';
import { FileDownloadComponent } from './files-management/file-download/file-download.component';
import { FileUploadComponent } from './files-management/file-upload/file-upload.component';
import { FileManagerComponent } from './files-management/file-manager/file-manager.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxMaskModule, IConfig } from 'ngx-mask';


export const maskConfig: Partial<IConfig> = {
  thousandSeparator: `,`,
  dropSpecialCharacters: true,
};

@NgModule({
  declarations: [
    ErrorDialogComponent,
    SuccessDialogComponent,
    ConfirmDialogComponent,
    BreadcrumbNavigatorComponent,
    LocalDatetimePipe,
    UploadComponent,
    FileDownloadComponent,
    FileUploadComponent,
    FileManagerComponent
    // InputClearDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    FlexLayoutModule,
    NgxSpinnerModule,
    NgxBarcodeModule,

    SweetAlert2Module.forRoot({ provideSwal }),
    NgxPaginationModule,

    ToastrModule.forRoot({
      timeOut: 5000,
      enableHtml: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true,
      tapToDismiss: false,
      progressBar: true,
      progressAnimation: 'increasing'
    }),

    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AngularSplitModule,
    PatientInfoModalModule,

    DxReportViewerModule,
    //NgxMaterialTimepickerModule.setLocale('th-TH'),
    NgxMaterialTimepickerModule,
    FilterPipeModule,
    NgxMaskModule.forRoot(maskConfig),

    // BsDatepickerModule.forRoot(),
    // DatepickerModule.forRoot(),
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,

    SweetAlert2Module,
    NgxPaginationModule,
    ToastrModule,
    BsDatepickerModule,
    NgxBarcodeModule,

    BreadcrumbNavigatorComponent,
    LocalDatetimePipe,
    AngularSplitModule,
    UploadComponent,
    FileDownloadComponent,
    FileUploadComponent,
    FileManagerComponent,
    DxReportViewerModule,
    NgxMaterialTimepickerModule,
    FilterPipeModule,
    NgxMaskModule
    // InputClearDirective
  ],
  providers: [
    BsModalRef,
    { provide: NgxMaterialTimepickerModule, useValue: 'th-TH' }
  ],
  // entryComponents: [
  //   SuccessDialogComponent,
  //   ErrorDialogComponent
  // ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return { ngModule: SharedModule };
  }
}

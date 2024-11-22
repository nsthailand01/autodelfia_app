import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ServerErrorComponent } from './error-pages/server-error/server-error.component';
import { AuthenticationGuard } from './helpers/authentication.guard';
import { DashboardExComponent } from './screens/dashboard-ex/dashboard-ex.component';
import { DynamicFormsComponent } from './screens/dynamic-forms/dynamic-forms.component';
import { PageNotfoundComponent } from './components/page-notfound/page-notfound.component';
import { CaptureCameraComponent } from './screens/capture-camera/capture-camera.component';
import { GenerateBarcodeExComponent } from './screens/generate-barcode-ex/generate-barcode-ex.component';
import { ReportViewerComponent } from './screens/report/report-viewer/report-viewer.component';

const appRoutes: Routes = [
  {
    path: '', component: MainLayoutComponent,
    children: [
      //{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '', redirectTo: 'register-patient', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard] },
      {
        path: 'register-sample',  /* ร้องขอ (ลงทะเบียน) */
        loadChildren: () => import('./screens/register-sample/register-sample.module').then(m => m.RegisterSampleModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'get-sample',
        loadChildren: () => import('./screens/autodelfia/get-sample/get-sample.module').then(m => m.GetSampleModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'register-patient',
        loadChildren: () => import('./screens/patient/patient.module').then(m => m.PatientModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'shipment-sample',  /* ใบนำส่งตัวอย่าง */
        loadChildren: () => import('./screens/shipment-sample/shipment-sample.module').then(m => m.ShipmentSampleModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'receive-sample',  /* รับตัวอย่างพร้อม generate barcode */
        loadChildren: () => import('./screens/receive-sample/receive-sample.module').then(m => m.ReceiveSampleModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'sent-to-analyzer',  /* บันทึกการนำข้อมูลเข้าเครื่องเพื่อทดสอบ */
        loadChildren: () => import('./screens/sent-to-analyzer/sent-to-analyzer.module').then(m => m.SentToAnalyzerModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'approve-center',
        loadChildren: () => import('./screens/approve-center/approve-center.module').then(m => m.ApproveCenterModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'sent-sample',
        loadChildren: () => import('./screens/sent-sample/sent-sample.module').then(m => m.SentSampleModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'delivery-note',
        loadChildren: () => import('./screens/delivery-note/delivery-note.module').then(m => m.DeliveryNoteModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'patient-record',
        loadChildren: () => import('./screens/patient-record/patient-record.module').then(m => m.PatientRecordModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'request-sample',
        loadChildren: () => import('./screens/request-sample/request-sample.module').then(m => m.RequestSampleModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'import-form',
        loadChildren: () => import('./screens/import-form/import-form.module').then(m => m.ImportFormModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'export-form',
        loadChildren: () => import('./screens/export-form/export-form.module').then(m => m.ExportFormModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'import-export',
        loadChildren: () => import('./screens/import-export-form/import-export-form.module').then(m => m.ImportExportFormModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'account',
        loadChildren: () => import('./screens/user-account/user-account.module').then(m => m.UserAccountModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'master-file',
        loadChildren: () => import('./screens/master-file/master-file.module').then(m => m.MasterFileModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'process-status',
        loadChildren: () => import('./screens/process-status/process-status.module').then(m => m.ProcessStatusModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'app-settings',
        loadChildren: () => import('./screens/app-settings/app-settings.module').then(m => m.AppSettingsModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'camera',
        component: CaptureCameraComponent
      },
      {
        path: 'barcode-gen',
        component: GenerateBarcodeExComponent
      },
      {
        path: 'report',
        loadChildren: () => import('./screens/report/report.module').then(m => m.ReportModule)
      },
      //สร้างเมนูใหม่ที่ไม่ใช้ไฟล์เดิม 
      {
        path: 'dmsinvoice',
        loadChildren: () => import('./screens/dmsinvoice/dmsinvoice.module').then(m => m.DmsinvoiceModule),
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'dmsreceive',
        loadChildren: () => import('./screens/dmsreceive/dmsreceive.module').then(m => m.DmsreceiveModule),
        canActivate: [AuthenticationGuard]
      },
    ]
  },

  { path: 'report-viewer', component: ReportViewerComponent },

  { path: 'dashboard-ex', component: DashboardExComponent },
  { path: 'dynamic-forms', component: DynamicFormsComponent },

  // { path: '404', component: NotFoundComponent },
  { path: '404', component: PageNotfoundComponent },
  { path: '500', component: ServerErrorComponent },
  { path: 'change-password', redirectTo: 'auth/change-password', pathMatch: 'full' },

  { path: 'login', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register-user', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'top',
      // enableTracing: true,
      useHash: true,
      onSameUrlNavigation: 'reload',
      //relativeLinkResolution: 'legacy'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

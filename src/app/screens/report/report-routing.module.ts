 import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportViewerComponent } from './report-viewer/report-viewer.component';


const routes: Routes = [
  // { path: '', redirectTo: 'report', pathMatch: 'full' },
  { path: '', component: ReportViewerComponent },
  // { path: 'analysisresultsreport', component: ReportViewerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }

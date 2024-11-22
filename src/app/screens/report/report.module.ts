import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportViewerComponent } from './report-viewer/report-viewer.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    ReportViewerComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ]
})
export class ReportModule { }

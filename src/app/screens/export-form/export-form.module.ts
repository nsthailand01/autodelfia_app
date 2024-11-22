import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportFormRoutingModule } from './export-form-routing.module';
import { ExportFormListComponent } from './export-form-list/export-form-list.component';
import { ExportFormCreateComponent } from './export-form-create/export-form-create.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    ExportFormListComponent,
    ExportFormCreateComponent
  ],
  imports: [
    CommonModule,
    ExportFormRoutingModule,
    SharedModule
  ]
})
export class ExportFormModule { }

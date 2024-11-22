import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportExportFormRoutingModule } from './import-export-form-routing.module';
import { ImportExportListComponent } from './import-export-list/import-export-list.component';
import { ImportExportCreateComponent } from './import-export-create/import-export-create.component';
import { SharedModule } from '@app/shared/shared.module';
import { ExportedListComponent } from './exported-list/exported-list.component';


@NgModule({
  declarations: [
    ImportExportListComponent,
    ImportExportCreateComponent,
    ExportedListComponent
  ],
  imports: [
    CommonModule,
    ImportExportFormRoutingModule,
    SharedModule
  ]
})
export class ImportExportFormModule { }

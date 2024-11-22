import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportFormRoutingModule } from './import-form-routing.module';
import { ImportFormListComponent } from './import-form-list/import-form-list.component';
import { ImportFormCreateComponent } from './import-form-create/import-form-create.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    ImportFormListComponent,
    ImportFormCreateComponent
  ],
  imports: [
    CommonModule,
    ImportFormRoutingModule,
    SharedModule
  ]
})
export class ImportFormModule { }

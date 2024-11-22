import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterFileRoutingModule } from './master-file-routing.module';
import { SampleTypeListComponent } from './sample-type/sample-type-list/sample-type-list.component';
import { SampleTypeCreateComponent } from './sample-type/sample-type-create/sample-type-create.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    SampleTypeListComponent,
    SampleTypeCreateComponent,
  ],
  imports: [
    CommonModule,
    MasterFileRoutingModule,
    SharedModule
  ]
})
export class MasterFileModule { }

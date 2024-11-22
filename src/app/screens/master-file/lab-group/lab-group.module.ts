import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabGroupRoutingModule } from './lab-group-routing.module';
import { LabGroupListComponent } from './lab-group-list/lab-group-list.component';
import { LabGroupCreateComponent } from './lab-group-create/lab-group-create.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    LabGroupListComponent,
    LabGroupCreateComponent
  ],
  imports: [
    CommonModule,
    LabGroupRoutingModule,
    SharedModule
  ]
})
export class LabGroupModule { }

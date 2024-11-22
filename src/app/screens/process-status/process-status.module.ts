import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessStatusRoutingModule } from './process-status-routing.module';
import { ProcessStatusListComponent } from './process-status-list/process-status-list.component';
import { ProcessStatusCreateComponent } from './process-status-create/process-status-create.component';


@NgModule({
  declarations: [
    ProcessStatusListComponent,
    ProcessStatusCreateComponent
  ],
  imports: [
    CommonModule,
    ProcessStatusRoutingModule
  ]
})
export class ProcessStatusModule { }

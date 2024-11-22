import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproveByLabRoutingModule } from './approve-by-lab-routing.module';
import { ApproveBylabListComponent } from './approve-bylab-list/approve-bylab-list.component';
import { ApproveBylabCreateComponent } from './approve-bylab-create/approve-bylab-create.component';


@NgModule({
  declarations: [
    ApproveBylabListComponent,
    ApproveBylabCreateComponent
  ],
  imports: [
    // CommonModule,
    ApproveByLabRoutingModule
  ]
})
export class ApproveByLabModule { }

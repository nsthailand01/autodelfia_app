import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproveByDoctorRoutingModule } from './approve-by-doctor-routing.module';
import { ApproveByDoctorListComponent } from './approve-by-doctor-list/approve-by-doctor-list.component';
import { ApproveByDoctorCreateComponent } from './approve-by-doctor-create/approve-by-doctor-create.component';


@NgModule({
  declarations: [ApproveByDoctorListComponent, ApproveByDoctorCreateComponent],
  imports: [
    // CommonModule,
    ApproveByDoctorRoutingModule
  ]
})
export class ApproveByDoctorModule { }

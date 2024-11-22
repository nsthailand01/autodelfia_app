import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientCreateComponent } from './patient-create/patient-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { PatientRecordRoutingModule } from './patient-record-routing.module';



@NgModule({
  declarations: [
    PatientListComponent,
    PatientCreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PatientRecordRoutingModule
  ]
})
export class PatientRecordModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientModalComponent } from './patient-modal/patient-modal.component';



@NgModule({
  declarations: [
    PatientModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PatientModalComponent
  ]
})
export class PatientInfoModalModule { }

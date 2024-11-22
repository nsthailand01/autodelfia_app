import { SamplesListTabComponent } from './samples-list-tab/samples-list-tab.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientCreateComponent } from './patient-create/patient-create.component';
import { PatientRegisterRangeComponent } from './patient-register-range/patient-register-range.component';
import { SharedModule } from '@app/shared/shared.module';
import { SharedTabsModule } from '@app/screens/shared-tabs/shared-tabs.module';
import { CreateShipmentComponent } from './create-shipment/create-shipment.component';

@NgModule({
  declarations: [
    PatientCreateComponent,
    PatientRegisterRangeComponent,
    SamplesListTabComponent,
    CreateShipmentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedTabsModule,
    PatientRoutingModule,
  ]
})
export class PatientModule { }

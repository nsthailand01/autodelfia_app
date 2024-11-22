import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestSampleRoutingModule } from './request-sample-routing.module';
import { RequestSampleListComponent } from './request-sample-list/request-sample-list.component';
import { RequestSampleCreateComponent } from './request-sample-create/request-sample-create.component';
import { SharedModule } from '@app/shared/shared.module';
import { AgencyTabComponent } from './tabs/agency-tab/agency-tab.component';
import { RegisterSampleTabComponent } from './tabs/register-sample-tab/register-sample-tab.component';
import { PregnantInfoTabComponent } from './tabs/pregnant-info-tab/pregnant-info-tab.component';
import { PregnancyHistoryTabComponent } from './tabs/pregnancy-history-tab/pregnancy-history-tab.component';
import { GestationalAgeTabComponent } from './tabs/gestational-age-tab/gestational-age-tab.component';
import { UltrasoundTabComponent } from './tabs/ultrasound-tab/ultrasound-tab.component';
import { BloodPressureTabComponent } from './tabs/blood-pressure-tab/blood-pressure-tab.component';
import { BloodSamplesTabComponent } from './tabs/blood-samples-tab/blood-samples-tab.component';
import { NhsoRecordInfoTabComponent } from './tabs/nhso-record-info-tab/nhso-record-info-tab.component';
import { PregnancyToxicResultsTabComponent } from './tabs/pregnancy-toxic-results-tab/pregnancy-toxic-results-tab.component';
import { RiskAssessmentResultsTabComponent } from './tabs/risk-assessment-results-tab/risk-assessment-results-tab.component';
import { AddnewRaceComponent } from './addnew-race/addnew-race.component';
import { PatientInfoPopupComponent } from './patient-info-popup/patient-info-popup.component';
import { AddnewDoctorComponent } from './addnew-doctor/addnew-doctor.component';
// import { AddnewDoctorComponent } from './addnew-doctor/addnew-doctor.component';

@NgModule({
  declarations: [
    RequestSampleListComponent,
    RequestSampleCreateComponent,
    AgencyTabComponent,
    RegisterSampleTabComponent,
    PregnantInfoTabComponent,
    PregnancyHistoryTabComponent,
    GestationalAgeTabComponent,
    UltrasoundTabComponent,
    BloodPressureTabComponent,
    BloodSamplesTabComponent,
    NhsoRecordInfoTabComponent,
    PregnancyToxicResultsTabComponent,
    RiskAssessmentResultsTabComponent,
    AddnewRaceComponent,
    PatientInfoPopupComponent,
    AddnewDoctorComponent,
    // AddnewDoctorComponent
  ],
  imports: [
    CommonModule,
    RequestSampleRoutingModule,
    SharedModule
  ]
})
export class RequestSampleModule { }

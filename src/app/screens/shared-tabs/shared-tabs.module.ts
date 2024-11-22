import { PatientInfoModalModule } from '@app/screens/patient-info-modal/patient-info-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedTabsRoutingModule } from './shared-tabs-routing.module';
import { SamplesTabComponent } from './samples-tab/samples-tab.component';
import { MaterialModule } from '@app/material/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { TestResultTabComponent } from './test-result-tab/test-result-tab.component';
import { PatientProfileTabComponent } from './patient-profile-tab/patient-profile-tab.component';
import { MarkAsteriskDirectiveModule } from '@app/directives/mark-asterisk.directive';
import { FormArrayFilterPipe } from './samples-tab/form-array-filter-pipe';
import { NiptResultTabComponent } from './nipt-result-tab/nipt-result-tab.component';
import { DiagnosticResultAmnioticTabComponent } from './diagnostic-result-amniotic-tab/diagnostic-result-amniotic-tab.component';
import { NiptScreeningResultTabComponent } from './nipt-screening-result-tab/nipt-screening-result-tab.component';

@NgModule({
  declarations: [
    SamplesTabComponent,
    TestResultTabComponent,
    PatientProfileTabComponent,
    FormArrayFilterPipe,
    NiptResultTabComponent,
    DiagnosticResultAmnioticTabComponent,
    NiptScreeningResultTabComponent,
  ],
  imports: [
    CommonModule,
    SharedTabsRoutingModule,
    PatientInfoModalModule,
    SharedModule,
    MaterialModule,
    MarkAsteriskDirectiveModule
  ],
  exports: [
    SamplesTabComponent,
    TestResultTabComponent,
    PatientProfileTabComponent,
    FormArrayFilterPipe,
    NiptResultTabComponent,
    DiagnosticResultAmnioticTabComponent,
    NiptScreeningResultTabComponent
  ]
})
export class SharedTabsModule { }

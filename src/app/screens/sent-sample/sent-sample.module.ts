import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SentSampleRoutingModule } from './sent-sample-routing.module';
import { SentSampleListComponent } from './sent-sample-list/sent-sample-list.component';
import { SentSampleCreateComponent } from './sent-sample-create/sent-sample-create.component';
import { SharedModule } from '@app/shared/shared.module';
import { SharedTabsModule } from '../shared-tabs/shared-tabs.module';


@NgModule({
  declarations: [
    SentSampleListComponent,
    SentSampleCreateComponent
  ],
  imports: [
    CommonModule,
    SentSampleRoutingModule,
    SharedModule,
    SharedTabsModule
  ]
})
export class SentSampleModule { }

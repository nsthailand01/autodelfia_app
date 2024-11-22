import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproveCenterRoutingModule } from './approve-center-routing.module';
import { ApproveListComponent } from './approve-list/approve-list.component';
import { ApproveCreateComponent } from './approve-create/approve-create.component';
import { ChangeDetectionComponent } from './change-detection/change-detection.component';
import { SharedModule } from '@app/shared/shared.module';
import { AddNewCommentComponent } from './add-new-comment/add-new-comment.component';
import { SharedTabsModule } from '../shared-tabs/shared-tabs.module';


@NgModule({
  declarations: [
    ApproveListComponent,
    ApproveCreateComponent,
    ChangeDetectionComponent,
    AddNewCommentComponent
  ],
  imports: [
    CommonModule,
    ApproveCenterRoutingModule,
    SharedModule,
    SharedTabsModule
  ]
})
export class ApproveCenterModule { }

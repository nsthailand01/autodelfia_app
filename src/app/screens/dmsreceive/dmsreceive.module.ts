import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DmsreceiveRoutingModule } from './dmsreceive-routing.module';
import { DmsreceiveListComponent } from './dmsreceive-list/dmsreceive-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { SharedTabsModule } from '../shared-tabs/shared-tabs.module';


@NgModule({
  declarations: [
    DmsreceiveListComponent
  ],
  imports: [
    CommonModule,
    DmsreceiveRoutingModule,
    SharedModule,
    SharedTabsModule
  ]
})
export class DmsreceiveModule { }

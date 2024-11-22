import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MssiteGroupRoutingModule } from './mssite-group-routing.module';
import { MssiteGroupListComponent } from './mssite-group-list/mssite-group-list.component';
import { MssiteGroupCreateComponent } from './mssite-group-create/mssite-group-create.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    MssiteGroupListComponent,
    MssiteGroupCreateComponent],
  imports: [
    CommonModule,
    MssiteGroupRoutingModule,
    SharedModule
  ]
})
export class MssiteGroupModule { }

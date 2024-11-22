import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositionRoutingModule } from './position-routing.module';
import { PositionListComponent } from './position-list/position-list.component';
import { PositionCreateComponent } from './position-create/position-create.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    PositionListComponent,
    PositionCreateComponent
  ],
  imports: [
    CommonModule,
    PositionRoutingModule,
    SharedModule
  ]
})
export class PositionModule { }

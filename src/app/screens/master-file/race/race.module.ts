import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RaceRoutingModule } from './race-routing.module';
import { RaceListComponent } from './race-list/race-list.component';
import { RaceCreateComponent } from './race-create/race-create.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    RaceListComponent,
    RaceCreateComponent
  ],
  imports: [
    CommonModule,
    RaceRoutingModule,
    SharedModule
  ]
})
export class RaceModule { }

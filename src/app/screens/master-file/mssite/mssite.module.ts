import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MssiteRoutingModule } from './mssite-routing.module';
import { MssiteListComponent } from './mssite-list/mssite-list.component';
import { MssiteCreateComponent } from './mssite-create/mssite-create.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    MssiteListComponent,
    MssiteCreateComponent
  ],
  imports: [
    CommonModule,
    MssiteRoutingModule,
    SharedModule
  ]
})
export class MssiteModule { }

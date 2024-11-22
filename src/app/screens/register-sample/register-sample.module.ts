import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterSampleRoutingModule } from './register-sample-routing.module';
import { RegisterSampleListComponent } from './register-sample-list/register-sample-list.component';
import { RegisterSampleCreateComponent } from './register-sample-create/register-sample-create.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    RegisterSampleListComponent,
    RegisterSampleCreateComponent
  ],
  imports: [
    CommonModule,
    RegisterSampleRoutingModule,
    SharedModule
  ]
})
export class RegisterSampleModule { }

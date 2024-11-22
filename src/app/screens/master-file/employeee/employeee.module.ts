import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeeRoutingModule } from './employeee-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeCreateComponent
  ],
  imports: [
    CommonModule,
    EmployeeeRoutingModule,
    SharedModule
  ]
})
export class EmployeeeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAccountRoutingModule } from './user-account-routing.module';
import { UserAccountListComponent } from './user-account-list/user-account-list.component';
import { UserAccountCreateComponent } from './user-account-create/user-account-create.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    UserAccountListComponent,
    UserAccountCreateComponent,
  ],
  imports: [
    CommonModule,
    UserAccountRoutingModule,
    SharedModule,
  ]
})
export class UserAccountModule { }

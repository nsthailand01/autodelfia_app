import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSettingsRoutingModule } from './app-settings-routing.module';
import { AppSettingsCreateComponent } from './app-settings-create/app-settings-create.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    AppSettingsCreateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppSettingsRoutingModule
  ]
})
export class AppSettingsModule { }

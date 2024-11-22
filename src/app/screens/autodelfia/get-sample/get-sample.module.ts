import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GetSampleRoutingModule } from './get-sample-routing.module';
import { GetSampleBarcodeComponent } from './get-sample-barcode/get-sample-barcode.component';
import { SharedModule } from '@app/shared/shared.module';
import { SharedTabsModule } from '@app/screens/shared-tabs/shared-tabs.module';

@NgModule({
  declarations: [
    GetSampleBarcodeComponent
  ],
  imports: [
    CommonModule,
    GetSampleRoutingModule,
    SharedModule,
    SharedTabsModule
  ]
})
export class GetSampleModule { }

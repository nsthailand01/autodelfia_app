import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiveSampleRoutingModule } from './receive-sample-routing.module';
import { ReceiveSampleListComponent } from './receive-sample-list/receive-sample-list.component';
import { ReceiveSampleCreateComponent } from './receive-sample-create/receive-sample-create.component';
import { SharedModule } from '@app/shared/shared.module';
import { SharedTabsModule } from '../shared-tabs/shared-tabs.module';
import { PrintLabnoBarcodeComponent } from './print-labno-barcode/print-labno-barcode.component';
import { PrintPageComponent } from './print-page/print-page.component';


@NgModule({
  declarations: [
    ReceiveSampleListComponent,
    ReceiveSampleCreateComponent,
    PrintLabnoBarcodeComponent,
    PrintPageComponent
  ],
  imports: [
    CommonModule,
    ReceiveSampleRoutingModule,
    SharedModule,
    SharedTabsModule
  ]
})
export class ReceiveSampleModule { }

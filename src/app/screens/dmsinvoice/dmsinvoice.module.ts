import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DmsinvoiceRoutingModule } from './dmsinvoice-routing.module';
import { DmsinvoiceListComponent } from './dmsinvoice-list/dmsinvoice-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { SharedTabsModule } from '../shared-tabs/shared-tabs.module';




@NgModule({
  declarations: [
    DmsinvoiceListComponent
  ],
  imports: [
    CommonModule,
    DmsinvoiceRoutingModule,
    SharedModule,
    SharedTabsModule
  ]
})
export class DmsinvoiceModule { }

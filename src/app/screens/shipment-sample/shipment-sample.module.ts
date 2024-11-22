import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShipmentSampleRoutingModule } from './shipment-sample-routing.module';
import { ShipmentSampleListComponent } from './shipment-sample-list/shipment-sample-list.component';
import { ShipmentSampleCreateComponent } from './shipment-sample-create/shipment-sample-create.component';


@NgModule({
  declarations: [
    ShipmentSampleListComponent,
    ShipmentSampleCreateComponent
  ],
  imports: [
    CommonModule,
    ShipmentSampleRoutingModule
  ]
})
export class ShipmentSampleModule { }

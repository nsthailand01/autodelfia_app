import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';
import { ShipmentSampleCreateComponent } from './shipment-sample-create/shipment-sample-create.component';
import { ShipmentSampleListComponent } from './shipment-sample-list/shipment-sample-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ShipmentSampleListComponent },
  {
    path: 'create', component: ShipmentSampleCreateComponent,
    data: { 'permissions': ['can_edit', 'can_delete'] },
    canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentSampleRoutingModule { }

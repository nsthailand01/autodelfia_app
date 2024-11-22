import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';
import { PrintLabnoBarcodeComponent } from './print-labno-barcode/print-labno-barcode.component';
import { ReceiveSampleCreateComponent } from './receive-sample-create/receive-sample-create.component';
import { ReceiveSampleListComponent } from './receive-sample-list/receive-sample-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'lists', component: ReceiveSampleListComponent },
  {
    path: 'create', component: ReceiveSampleCreateComponent,
    data: { permissions: ['can_edit', 'can_delete'] },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'edit', component: ReceiveSampleCreateComponent,
    data: { permissions: ['can_edit', 'can_delete'] },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'print-barcode', component: PrintLabnoBarcodeComponent,
    data: { permissions: ['can_edit', 'can_delete'] },
    canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiveSampleRoutingModule { }

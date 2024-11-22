import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryNoteListComponent } from './delivery-note-list/delivery-note-list.component';
import { DeliveryNoteCreateComponent } from './delivery-note-create/delivery-note-create.component';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: DeliveryNoteListComponent },
  { path: 'create', component: DeliveryNoteCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit', component: DeliveryNoteCreateComponent, canDeactivate: [CanDeactivateGuard] },
  // { path: 'details/:id', component: OwnerDetailsComponent },
  // { path: 'create', component: OwnerCreateComponent },
  // { path: 'update/:id', component: OwnerUpdateComponent },
  // { path: 'delete/:id', component: OwnerDeleteComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class DeliveryNoteRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MssiteGroupListComponent } from './mssite-group-list/mssite-group-list.component';
import { MssiteGroupCreateComponent } from './mssite-group-create/mssite-group-create.component';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: MssiteGroupListComponent },
  { path: 'create', component: MssiteGroupCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit', component: MssiteGroupCreateComponent, canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MssiteGroupRoutingModule { }

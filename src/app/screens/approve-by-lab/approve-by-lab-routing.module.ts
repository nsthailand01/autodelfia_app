import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';
import { ApproveBylabCreateComponent } from './approve-bylab-create/approve-bylab-create.component';
import { ApproveBylabListComponent } from './approve-bylab-list/approve-bylab-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ApproveBylabListComponent },
  {
    path: 'create', component: ApproveBylabCreateComponent,
    data: { 'permissions': ['can_edit', 'can_delete'] },
    canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproveByLabRoutingModule { }

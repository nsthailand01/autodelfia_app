import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LabGroupListComponent } from './lab-group-list/lab-group-list.component';
import { LabGroupCreateComponent } from './lab-group-create/lab-group-create.component';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: LabGroupListComponent },
  { path: 'create', component: LabGroupCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit', component: LabGroupCreateComponent, canDeactivate: [CanDeactivateGuard]  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabGroupRoutingModule { }

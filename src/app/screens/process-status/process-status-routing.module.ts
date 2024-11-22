import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';
import { ProcessStatusCreateComponent } from './process-status-create/process-status-create.component';
import { ProcessStatusListComponent } from './process-status-list/process-status-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: ProcessStatusListComponent },
  { path: 'create', component: ProcessStatusCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit', component: ProcessStatusCreateComponent, canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessStatusRoutingModule { }

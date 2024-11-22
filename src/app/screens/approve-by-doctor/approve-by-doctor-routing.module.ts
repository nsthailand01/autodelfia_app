import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';
import { ApproveByDoctorCreateComponent } from './approve-by-doctor-create/approve-by-doctor-create.component';
import { ApproveByDoctorListComponent } from './approve-by-doctor-list/approve-by-doctor-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ApproveByDoctorListComponent },
  {
    path: 'create', component: ApproveByDoctorCreateComponent,
    data: { 'permissions': ['can_edit', 'can_delete'] },
    canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproveByDoctorRoutingModule { }

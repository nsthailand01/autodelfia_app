import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SampleTypeListComponent } from './sample-type/sample-type-list/sample-type-list.component';
import { SampleTypeCreateComponent } from './sample-type/sample-type-create/sample-type-create.component';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';

const routes: Routes = [
  { path: 'sample-type/lists', component: SampleTypeListComponent },
  { path: 'sample-type/create', component: SampleTypeCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'sample-type/edit', component: SampleTypeCreateComponent, canDeactivate: [CanDeactivateGuard] },
  {
    path: 'department',
    loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule)
  },
  {
    path: 'mssite',
    loadChildren: () => import('./mssite/mssite.module').then(m => m.MssiteModule)
  },
  {
    path: 'mssite-group',
    loadChildren: () => import('./mssite-group/mssite-group.module').then(m => m.MssiteGroupModule)
  },
  {
    path: 'position',
    loadChildren: () => import('./position/position.module').then(m => m.PositionModule)
  },
  {
    path: 'lab-group',
    loadChildren: () => import('./lab-group/lab-group.module').then(m => m.LabGroupModule)
  },
  {
    path: 'employee',
    loadChildren: () => import('./employeee/employeee.module').then(m => m.EmployeeeModule)
  },
  {
    path: 'race',
    loadChildren: () => import('./race/race.module').then(m => m.RaceModule)
  },
  {
    path: 'objective',
    loadChildren: () => import('./objective/objective.module').then(m => m.ObjectiveModule)
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterFileRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';
import { RegisterSampleCreateComponent } from './register-sample-create/register-sample-create.component';
import { RegisterSampleListComponent } from './register-sample-list/register-sample-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: RegisterSampleListComponent },
  {
    path: 'create', component: RegisterSampleCreateComponent,
    data: { 'permissions': ['can_edit', 'can_delete'] },
    canDeactivate: [CanDeactivateGuard]
  },
  { path: 'create/:fromOrigin', component: RegisterSampleCreateComponent, canDeactivate: [CanDeactivateGuard] },
];

// const routes: Routes = [
//   { path: '', redirectTo: 'lists', pathMatch: 'full' },
//   { path: 'lists', component: RequestSampleListComponent },
//   { path: 'create', component: RequestSampleCreateComponent, canDeactivate: [CanDeactivateGuard] },
//   { path: 'create/:fromOrigin', component: RequestSampleCreateComponent, canDeactivate: [CanDeactivateGuard] },
//   { path: 'edit', component: RequestSampleCreateComponent, canDeactivate: [CanDeactivateGuard] },
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterSampleRoutingModule { }

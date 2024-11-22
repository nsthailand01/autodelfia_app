import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestSampleListComponent } from './request-sample-list/request-sample-list.component';
import { RequestSampleCreateComponent } from './request-sample-create/request-sample-create.component';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: RequestSampleListComponent },
  { path: 'create', component: RequestSampleCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'create/:fromOrigin', component: RequestSampleCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit', component: RequestSampleCreateComponent, canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestSampleRoutingModule { }

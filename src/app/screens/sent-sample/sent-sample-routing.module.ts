import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';
import { SentSampleListComponent } from './sent-sample-list/sent-sample-list.component';
import { SentSampleCreateComponent } from './sent-sample-create/sent-sample-create.component';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: SentSampleListComponent },
  {
    path: 'create', component: SentSampleCreateComponent,
    data: { permissions: ['can_edit', 'can_delete'] },
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'edit', component: SentSampleCreateComponent,
    data: { permissions: ['can_edit', 'can_delete'] },
    canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SentSampleRoutingModule { }

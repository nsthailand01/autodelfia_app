import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAccountListComponent } from './user-account-list/user-account-list.component';
import { UserAccountCreateComponent } from './user-account-create/user-account-create.component';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: UserAccountListComponent },
  { path: 'create', component: UserAccountCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit', component: UserAccountCreateComponent, canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAccountRoutingModule { }

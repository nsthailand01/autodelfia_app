import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MssiteListComponent } from './mssite-list/mssite-list.component';
import { MssiteCreateComponent } from './mssite-create/mssite-create.component';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: MssiteListComponent },
  { path: 'create', component: MssiteCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit', component: MssiteCreateComponent, canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MssiteRoutingModule { }

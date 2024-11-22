import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionCreateComponent } from './position-create/position-create.component';
import { PositionListComponent } from './position-list/position-list.component';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: PositionListComponent },
  { path: 'create', component: PositionCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit', component: PositionCreateComponent, canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionRoutingModule { }

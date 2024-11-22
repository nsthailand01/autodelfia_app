import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';
import { RaceCreateComponent } from './race-create/race-create.component';
import { RaceListComponent } from './race-list/race-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: RaceListComponent },
  { path: 'create', component: RaceCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit', component: RaceCreateComponent, canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RaceRoutingModule { }

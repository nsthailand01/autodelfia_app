import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObjectiveListComponent } from './objective-list/objective-list.component';
import { ObjectiveCreateComponent } from './objective-create/objective-create.component';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';

const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: ObjectiveListComponent },
  { path: 'create', component: ObjectiveCreateComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'edit', component: ObjectiveCreateComponent, canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjectiveRoutingModule { }

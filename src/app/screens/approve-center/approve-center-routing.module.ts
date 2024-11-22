import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';
import { AppSettingsResolverService } from '@app/resolvers/app-settings-resolver.service';
import { ApproveCreateComponent } from './approve-create/approve-create.component';
import { ApproveListComponent } from './approve-list/approve-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: ApproveListComponent },
  {
    path: 'create', component: ApproveCreateComponent,
    data: { permissions: ['can_edit', 'can_delete'] },
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      appSettings: AppSettingsResolverService
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproveCenterRoutingModule { }

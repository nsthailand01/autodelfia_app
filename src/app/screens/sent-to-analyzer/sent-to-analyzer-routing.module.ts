import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/helpers/can-deactivate.guard';
import { SentToAnalyzerCreateComponent } from './sent-to-analyzer-create/sent-to-analyzer-create.component';
import { SentToAnalyzerListComponent } from './sent-to-analyzer-list/sent-to-analyzer-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: SentToAnalyzerListComponent },
  {
    path: 'create', component: SentToAnalyzerCreateComponent,
    data: { 'permissions': ['can_edit', 'can_delete'] },
    canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SentToAnalyzerRoutingModule { }

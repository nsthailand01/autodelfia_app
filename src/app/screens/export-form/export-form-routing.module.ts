import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExportFormListComponent } from './export-form-list/export-form-list.component';
import { ExportFormCreateComponent } from './export-form-create/export-form-create.component';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: ExportFormListComponent },
  { path: 'create', component: ExportFormCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportFormRoutingModule { }

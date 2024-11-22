import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportFormListComponent } from './import-form-list/import-form-list.component';
import { ImportFormCreateComponent } from './import-form-create/import-form-create.component';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: ImportFormListComponent },
  { path: 'create', component: ImportFormCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportFormRoutingModule { }

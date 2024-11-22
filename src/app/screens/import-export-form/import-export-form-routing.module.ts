import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportExportCreateComponent } from './import-export-create/import-export-create.component';
import { ImportExportListComponent } from './import-export-list/import-export-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: ImportExportListComponent },
  { path: 'create', component: ImportExportCreateComponent },
  { path: 'edit', component: ImportExportCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportExportFormRoutingModule { }

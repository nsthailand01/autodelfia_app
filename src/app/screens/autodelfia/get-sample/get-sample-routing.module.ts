import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GetSampleBarcodeComponent } from './get-sample-barcode/get-sample-barcode.component';



const routes: Routes = [
  { path: '', redirectTo: 'create', pathMatch: 'full' },
  { path: 'barcode', component: GetSampleBarcodeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetSampleRoutingModule { }

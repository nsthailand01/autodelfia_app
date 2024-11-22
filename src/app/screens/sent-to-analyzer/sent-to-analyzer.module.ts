import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SentToAnalyzerRoutingModule } from './sent-to-analyzer-routing.module';
import { SentToAnalyzerListComponent } from './sent-to-analyzer-list/sent-to-analyzer-list.component';
import { SentToAnalyzerCreateComponent } from './sent-to-analyzer-create/sent-to-analyzer-create.component';


@NgModule({
  declarations: [
    SentToAnalyzerListComponent,
    SentToAnalyzerCreateComponent
  ],
  imports: [
    CommonModule,
    SentToAnalyzerRoutingModule
  ]
})
export class SentToAnalyzerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObjectiveRoutingModule } from './objective-routing.module';
import { ObjectiveCreateComponent } from './objective-create/objective-create.component';
import { ObjectiveListComponent } from './objective-list/objective-list.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    ObjectiveCreateComponent,
    ObjectiveListComponent
  ],
  imports: [
    CommonModule,
    ObjectiveRoutingModule,
    SharedModule
  ]
})
export class ObjectiveModule { }

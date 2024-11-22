import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryNoteListComponent } from './delivery-note-list/delivery-note-list.component';
import { DeliveryNoteCreateComponent } from './delivery-note-create/delivery-note-create.component';
import { SharedModule } from '@app/shared/shared.module';
import { DeliveryNoteRoutingModule } from './delivery-note-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedTabsModule } from '../shared-tabs/shared-tabs.module';

@NgModule({
  declarations: [
    DeliveryNoteListComponent,
    DeliveryNoteCreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DeliveryNoteRoutingModule,
    SharedModule,
    SharedTabsModule
  ]
})
export class DeliveryNoteModule { }

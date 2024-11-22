import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeliveryNoteListComponent } from './delivery-note-list.component';

describe('DeliveryNoteListComponent', () => {
  let component: DeliveryNoteListComponent;
  let fixture: ComponentFixture<DeliveryNoteListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryNoteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeliveryNoteCreateComponent } from './delivery-note-create.component';

describe('DeliveryNoteCreateComponent', () => {
  let component: DeliveryNoteCreateComponent;
  let fixture: ComponentFixture<DeliveryNoteCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryNoteCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryNoteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

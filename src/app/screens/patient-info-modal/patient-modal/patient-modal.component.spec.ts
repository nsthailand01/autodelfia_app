import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientModalComponent } from './patient-modal.component';

describe('PatientModalComponent', () => {
  let component: PatientModalComponent;
  let fixture: ComponentFixture<PatientModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

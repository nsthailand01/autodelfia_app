import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRegisterRangeComponent } from './patient-register-range.component';

describe('NbsPatientRegisterRangeComponent', () => {
  let component: PatientRegisterRangeComponent;
  let fixture: ComponentFixture<PatientRegisterRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientRegisterRangeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRegisterRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

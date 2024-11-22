import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientInfoPopupComponent } from './patient-info-popup.component';

describe('PatientInfoPopupComponent', () => {
  let component: PatientInfoPopupComponent;
  let fixture: ComponentFixture<PatientInfoPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientInfoPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

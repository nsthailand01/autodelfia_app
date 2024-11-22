import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientProfileTabComponent } from './patient-profile-tab.component';

describe('PatientProfileTabComponent', () => {
  let component: PatientProfileTabComponent;
  let fixture: ComponentFixture<PatientProfileTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientProfileTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientProfileTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

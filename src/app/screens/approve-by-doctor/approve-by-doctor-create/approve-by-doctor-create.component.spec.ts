import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApproveByDoctorCreateComponent } from './approve-by-doctor-create.component';

describe('ApproveByDoctorCreateComponent', () => {
  let component: ApproveByDoctorCreateComponent;
  let fixture: ComponentFixture<ApproveByDoctorCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveByDoctorCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveByDoctorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

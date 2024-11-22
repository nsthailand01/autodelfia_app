import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApproveByDoctorListComponent } from './approve-by-doctor-list.component';

describe('ApproveByDoctorListComponent', () => {
  let component: ApproveByDoctorListComponent;
  let fixture: ComponentFixture<ApproveByDoctorListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveByDoctorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveByDoctorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

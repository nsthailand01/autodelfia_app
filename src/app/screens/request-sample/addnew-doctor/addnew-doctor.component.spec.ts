import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewDoctorComponent } from './addnew-doctor.component';

describe('AddnewDoctorComponent', () => {
  let component: AddnewDoctorComponent;
  let fixture: ComponentFixture<AddnewDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnewDoctorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

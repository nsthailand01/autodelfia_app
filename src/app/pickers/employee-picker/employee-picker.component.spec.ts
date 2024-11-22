import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeePickerComponent } from './employee-picker.component';

describe('EmployeePickerComponent', () => {
  let component: EmployeePickerComponent;
  let fixture: ComponentFixture<EmployeePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

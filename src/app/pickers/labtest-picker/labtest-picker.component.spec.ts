import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LabtestPickerComponent } from './labtest-picker.component';

describe('LabtestPickerComponent', () => {
  let component: LabtestPickerComponent;
  let fixture: ComponentFixture<LabtestPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LabtestPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabtestPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

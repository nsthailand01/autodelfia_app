import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MssitePickerComponent } from './mssite-picker.component';

describe('MssitePickerComponent', () => {
  let component: MssitePickerComponent;
  let fixture: ComponentFixture<MssitePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MssitePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MssitePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

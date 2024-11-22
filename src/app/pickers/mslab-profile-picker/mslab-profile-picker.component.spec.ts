import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MslabProfilePickerComponent } from './mslab-profile-picker.component';

describe('MslabProfilePickerComponent', () => {
  let component: MslabProfilePickerComponent;
  let fixture: ComponentFixture<MslabProfilePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MslabProfilePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MslabProfilePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

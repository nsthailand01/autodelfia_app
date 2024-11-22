import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SampleTypePickerComponent } from './sample-type-picker.component';

describe('SampleTypePickerComponent', () => {
  let component: SampleTypePickerComponent;
  let fixture: ComponentFixture<SampleTypePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleTypePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTypePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

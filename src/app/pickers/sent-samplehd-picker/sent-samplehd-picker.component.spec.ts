import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SentSamplehdPickerComponent } from './sent-samplehd-picker.component';

describe('SentSamplehdPickerComponent', () => {
  let component: SentSamplehdPickerComponent;
  let fixture: ComponentFixture<SentSamplehdPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SentSamplehdPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentSamplehdPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

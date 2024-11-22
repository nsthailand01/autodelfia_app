import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BloodSamplesTabComponent } from './blood-samples-tab.component';

describe('BloodSamplesTabComponent', () => {
  let component: BloodSamplesTabComponent;
  let fixture: ComponentFixture<BloodSamplesTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodSamplesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodSamplesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

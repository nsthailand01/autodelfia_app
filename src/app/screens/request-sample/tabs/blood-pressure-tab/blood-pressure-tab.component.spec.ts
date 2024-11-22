import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BloodPressureTabComponent } from './blood-pressure-tab.component';

describe('BloodPressureTabComponent', () => {
  let component: BloodPressureTabComponent;
  let fixture: ComponentFixture<BloodPressureTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodPressureTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodPressureTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

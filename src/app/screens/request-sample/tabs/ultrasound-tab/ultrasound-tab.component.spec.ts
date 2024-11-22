import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UltrasoundTabComponent } from './ultrasound-tab.component';

describe('UltrasoundTabComponent', () => {
  let component: UltrasoundTabComponent;
  let fixture: ComponentFixture<UltrasoundTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UltrasoundTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UltrasoundTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

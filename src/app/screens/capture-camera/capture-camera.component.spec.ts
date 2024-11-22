import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CaptureCameraComponent } from './capture-camera.component';

describe('CaptureCameraComponent', () => {
  let component: CaptureCameraComponent;
  let fixture: ComponentFixture<CaptureCameraComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptureCameraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

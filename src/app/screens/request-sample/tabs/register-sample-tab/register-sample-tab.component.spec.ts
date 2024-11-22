import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegisterSampleTabComponent } from './register-sample-tab.component';

describe('RegisterSampleTabComponent', () => {
  let component: RegisterSampleTabComponent;
  let fixture: ComponentFixture<RegisterSampleTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterSampleTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSampleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

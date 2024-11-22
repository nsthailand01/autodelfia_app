import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegisterSampleCreateComponent } from './register-sample-create.component';

describe('RegisterSampleCreateComponent', () => {
  let component: RegisterSampleCreateComponent;
  let fixture: ComponentFixture<RegisterSampleCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterSampleCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSampleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

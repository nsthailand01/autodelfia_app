import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegisterSampleListComponent } from './register-sample-list.component';

describe('RegisterSampleListComponent', () => {
  let component: RegisterSampleListComponent;
  let fixture: ComponentFixture<RegisterSampleListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterSampleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSampleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

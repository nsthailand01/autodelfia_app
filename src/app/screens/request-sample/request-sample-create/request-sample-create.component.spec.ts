import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestSampleCreateComponent } from './request-sample-create.component';

describe('RequestSampleCreateComponent', () => {
  let component: RequestSampleCreateComponent;
  let fixture: ComponentFixture<RequestSampleCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestSampleCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSampleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

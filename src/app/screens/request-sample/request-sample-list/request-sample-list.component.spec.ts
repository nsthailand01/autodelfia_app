import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestSampleListComponent } from './request-sample-list.component';

describe('RequestSampleListComponent', () => {
  let component: RequestSampleListComponent;
  let fixture: ComponentFixture<RequestSampleListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestSampleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSampleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

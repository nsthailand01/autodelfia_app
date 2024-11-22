import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProcessStatusListComponent } from './process-status-list.component';

describe('ProcessStatusListComponent', () => {
  let component: ProcessStatusListComponent;
  let fixture: ComponentFixture<ProcessStatusListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

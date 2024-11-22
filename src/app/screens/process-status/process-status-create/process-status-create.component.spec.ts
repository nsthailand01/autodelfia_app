import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProcessStatusCreateComponent } from './process-status-create.component';

describe('ProcessStatusCreateComponent', () => {
  let component: ProcessStatusCreateComponent;
  let fixture: ComponentFixture<ProcessStatusCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessStatusCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessStatusCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

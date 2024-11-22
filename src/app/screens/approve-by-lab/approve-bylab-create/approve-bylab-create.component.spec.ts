import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApproveBylabCreateComponent } from './approve-bylab-create.component';

describe('ApproveBylabCreateComponent', () => {
  let component: ApproveBylabCreateComponent;
  let fixture: ComponentFixture<ApproveBylabCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveBylabCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveBylabCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

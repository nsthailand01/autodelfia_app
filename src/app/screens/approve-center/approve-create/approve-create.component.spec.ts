import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApproveCreateComponent } from './approve-create.component';

describe('ApproveCreateComponent', () => {
  let component: ApproveCreateComponent;
  let fixture: ComponentFixture<ApproveCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

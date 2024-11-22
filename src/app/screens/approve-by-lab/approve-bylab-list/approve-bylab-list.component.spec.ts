import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApproveBylabListComponent } from './approve-bylab-list.component';

describe('ApproveBylabListComponent', () => {
  let component: ApproveBylabListComponent;
  let fixture: ComponentFixture<ApproveBylabListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveBylabListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveBylabListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardExComponent } from './dashboard-ex.component';

describe('DashboardExComponent', () => {
  let component: DashboardExComponent;
  let fixture: ComponentFixture<DashboardExComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardExComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

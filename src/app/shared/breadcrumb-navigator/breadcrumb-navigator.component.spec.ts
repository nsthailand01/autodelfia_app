import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BreadcrumbNavigatorComponent } from './breadcrumb-navigator.component';

describe('BreadcrumbNavigatorComponent', () => {
  let component: BreadcrumbNavigatorComponent;
  let fixture: ComponentFixture<BreadcrumbNavigatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BreadcrumbNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

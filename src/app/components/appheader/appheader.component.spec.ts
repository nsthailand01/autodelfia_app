import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppheaderComponent } from './appheader.component';

describe('AppheaderComponent', () => {
  let component: AppheaderComponent;
  let fixture: ComponentFixture<AppheaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

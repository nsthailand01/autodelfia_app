import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppfooterComponent } from './appfooter.component';

describe('AppfooterComponent', () => {
  let component: AppfooterComponent;
  let fixture: ComponentFixture<AppfooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppfooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

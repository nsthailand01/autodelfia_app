import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestResultTabComponent } from './test-result-tab.component';

describe('TestResultTabComponent', () => {
  let component: TestResultTabComponent;
  let fixture: ComponentFixture<TestResultTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestResultTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResultTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

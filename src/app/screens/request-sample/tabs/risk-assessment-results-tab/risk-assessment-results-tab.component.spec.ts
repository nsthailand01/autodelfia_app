import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RiskAssessmentResultsTabComponent } from './risk-assessment-results-tab.component';

describe('RiskAssessmentResultsTabComponent', () => {
  let component: RiskAssessmentResultsTabComponent;
  let fixture: ComponentFixture<RiskAssessmentResultsTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssessmentResultsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssessmentResultsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

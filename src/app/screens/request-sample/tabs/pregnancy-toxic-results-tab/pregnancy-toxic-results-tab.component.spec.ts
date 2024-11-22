import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PregnancyToxicResultsTabComponent } from './pregnancy-toxic-results-tab.component';

describe('PregnancyToxicResultsTabComponent', () => {
  let component: PregnancyToxicResultsTabComponent;
  let fixture: ComponentFixture<PregnancyToxicResultsTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PregnancyToxicResultsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregnancyToxicResultsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

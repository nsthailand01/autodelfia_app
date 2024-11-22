import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PregnancyHistoryTabComponent } from './pregnancy-history-tab.component';

describe('PregnancyHistoryTabComponent', () => {
  let component: PregnancyHistoryTabComponent;
  let fixture: ComponentFixture<PregnancyHistoryTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PregnancyHistoryTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregnancyHistoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SentToAnalyzerListComponent } from './sent-to-analyzer-list.component';

describe('SentToAnalyzerListComponent', () => {
  let component: SentToAnalyzerListComponent;
  let fixture: ComponentFixture<SentToAnalyzerListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SentToAnalyzerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentToAnalyzerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

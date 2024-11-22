import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SentToAnalyzerCreateComponent } from './sent-to-analyzer-create.component';

describe('SentToAnalyzerCreateComponent', () => {
  let component: SentToAnalyzerCreateComponent;
  let fixture: ComponentFixture<SentToAnalyzerCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SentToAnalyzerCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentToAnalyzerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

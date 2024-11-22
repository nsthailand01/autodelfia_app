import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SentSampleListComponent } from './sent-sample-list.component';

describe('SentSampleListComponent', () => {
  let component: SentSampleListComponent;
  let fixture: ComponentFixture<SentSampleListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SentSampleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentSampleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

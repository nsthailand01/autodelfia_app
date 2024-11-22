import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SentSampleCreateComponent } from './sent-sample-create.component';

describe('SentSampleCreateComponent', () => {
  let component: SentSampleCreateComponent;
  let fixture: ComponentFixture<SentSampleCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SentSampleCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentSampleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

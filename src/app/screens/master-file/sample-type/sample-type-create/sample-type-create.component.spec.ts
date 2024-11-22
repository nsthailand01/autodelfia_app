import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SampleTypeCreateComponent } from './sample-type-create.component';

describe('SampleTypeCreateComponent', () => {
  let component: SampleTypeCreateComponent;
  let fixture: ComponentFixture<SampleTypeCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleTypeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

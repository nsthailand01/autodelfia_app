import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SamplesTabComponent } from './samples-tab.component';

describe('SamplesTabComponent', () => {
  let component: SamplesTabComponent;
  let fixture: ComponentFixture<SamplesTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

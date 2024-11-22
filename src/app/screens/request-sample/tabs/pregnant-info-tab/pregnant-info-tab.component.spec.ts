import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PregnantInfoTabComponent } from './pregnant-info-tab.component';

describe('PregnantInfoTabComponent', () => {
  let component: PregnantInfoTabComponent;
  let fixture: ComponentFixture<PregnantInfoTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PregnantInfoTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PregnantInfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

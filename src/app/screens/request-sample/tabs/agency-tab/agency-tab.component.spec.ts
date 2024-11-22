import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgencyTabComponent } from './agency-tab.component';

describe('AgencyTabComponent', () => {
  let component: AgencyTabComponent;
  let fixture: ComponentFixture<AgencyTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

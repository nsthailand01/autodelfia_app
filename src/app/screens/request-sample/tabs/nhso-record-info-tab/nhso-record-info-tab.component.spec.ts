import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NhsoRecordInfoTabComponent } from './nhso-record-info-tab.component';

describe('NhsoRecordInfoTabComponent', () => {
  let component: NhsoRecordInfoTabComponent;
  let fixture: ComponentFixture<NhsoRecordInfoTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NhsoRecordInfoTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhsoRecordInfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

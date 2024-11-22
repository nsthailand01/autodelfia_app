import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReceiveSampleListComponent } from './receive-sample-list.component';

describe('ReceiveSampleListComponent', () => {
  let component: ReceiveSampleListComponent;
  let fixture: ComponentFixture<ReceiveSampleListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveSampleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveSampleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

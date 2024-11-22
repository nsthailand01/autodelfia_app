import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReceiveSampleCreateComponent } from './receive-sample-create.component';

describe('ReceiveSampleCreateComponent', () => {
  let component: ReceiveSampleCreateComponent;
  let fixture: ComponentFixture<ReceiveSampleCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveSampleCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveSampleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

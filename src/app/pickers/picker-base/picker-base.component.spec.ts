import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PickerBaseComponent } from './picker-base.component';

describe('PickerBaseComponent', () => {
  let component: PickerBaseComponent;
  let fixture: ComponentFixture<PickerBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PickerBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

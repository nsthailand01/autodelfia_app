import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabnumberPickerComponent } from './labnumber-picker.component';

describe('LabnumberPickerComponent', () => {
  let component: LabnumberPickerComponent;
  let fixture: ComponentFixture<LabnumberPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabnumberPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabnumberPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

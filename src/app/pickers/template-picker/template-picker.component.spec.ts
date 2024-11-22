import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplatePickerComponent } from './template-picker.component';

describe('TemplatePickerComponent', () => {
  let component: TemplatePickerComponent;
  let fixture: ComponentFixture<TemplatePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

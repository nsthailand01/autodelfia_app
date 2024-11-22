import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExportFormCreateComponent } from './export-form-create.component';

describe('ExportFormCreateComponent', () => {
  let component: ExportFormCreateComponent;
  let fixture: ComponentFixture<ExportFormCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportFormCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFormCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExportFormListComponent } from './export-form-list.component';

describe('ExportFormListComponent', () => {
  let component: ExportFormListComponent;
  let fixture: ComponentFixture<ExportFormListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportFormListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

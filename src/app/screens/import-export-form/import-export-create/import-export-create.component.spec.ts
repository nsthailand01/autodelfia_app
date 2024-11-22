import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportExportCreateComponent } from './import-export-create.component';

describe('ImportExportCreateComponent', () => {
  let component: ImportExportCreateComponent;
  let fixture: ComponentFixture<ImportExportCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExportCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExportCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

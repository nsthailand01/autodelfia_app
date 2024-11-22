import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportExportListComponent } from './import-export-list.component';

describe('ImportExportListComponent', () => {
  let component: ImportExportListComponent;
  let fixture: ComponentFixture<ImportExportListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

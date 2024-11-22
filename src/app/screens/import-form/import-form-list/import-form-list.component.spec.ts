import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportFormListComponent } from './import-form-list.component';

describe('ImportFormListComponent', () => {
  let component: ImportFormListComponent;
  let fixture: ComponentFixture<ImportFormListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFormListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

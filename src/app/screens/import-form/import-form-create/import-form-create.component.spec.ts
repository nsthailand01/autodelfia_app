import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportFormCreateComponent } from './import-form-create.component';

describe('ImportFormCreateComponent', () => {
  let component: ImportFormCreateComponent;
  let fixture: ComponentFixture<ImportFormCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFormCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFormCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

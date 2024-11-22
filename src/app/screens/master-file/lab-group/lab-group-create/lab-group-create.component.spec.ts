import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LabGroupCreateComponent } from './lab-group-create.component';

describe('LabGroupCreateComponent', () => {
  let component: LabGroupCreateComponent;
  let fixture: ComponentFixture<LabGroupCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LabGroupCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabGroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

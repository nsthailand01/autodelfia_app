import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LabGroupListComponent } from './lab-group-list.component';

describe('LabGroupListComponent', () => {
  let component: LabGroupListComponent;
  let fixture: ComponentFixture<LabGroupListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LabGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

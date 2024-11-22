import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExportedListComponent } from './exported-list.component';

describe('ExportedListComponent', () => {
  let component: ExportedListComponent;
  let fixture: ComponentFixture<ExportedListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmsreceiveListComponent } from './dmsreceive-list.component';

describe('DmsreceiveListComponent', () => {
  let component: DmsreceiveListComponent;
  let fixture: ComponentFixture<DmsreceiveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmsreceiveListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmsreceiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

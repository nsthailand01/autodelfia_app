import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MssiteGroupListComponent } from './mssite-group-list.component';

describe('MssiteGroupListComponent', () => {
  let component: MssiteGroupListComponent;
  let fixture: ComponentFixture<MssiteGroupListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MssiteGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MssiteGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MssiteListComponent } from './mssite-list.component';

describe('MssiteListComponent', () => {
  let component: MssiteListComponent;
  let fixture: ComponentFixture<MssiteListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MssiteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MssiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

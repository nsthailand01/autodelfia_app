import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MssiteGroupCreateComponent } from './mssite-group-create.component';

describe('MssiteGroupCreateComponent', () => {
  let component: MssiteGroupCreateComponent;
  let fixture: ComponentFixture<MssiteGroupCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MssiteGroupCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MssiteGroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MssiteCreateComponent } from './mssite-create.component';

describe('MssiteCreateComponent', () => {
  let component: MssiteCreateComponent;
  let fixture: ComponentFixture<MssiteCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MssiteCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MssiteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

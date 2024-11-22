import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RaceCreateComponent } from './race-create.component';

describe('RaceCreateComponent', () => {
  let component: RaceCreateComponent;
  let fixture: ComponentFixture<RaceCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

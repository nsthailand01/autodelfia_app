import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GestationalAgeTabComponent } from './gestational-age-tab.component';

describe('GestationalAgeTabComponent', () => {
  let component: GestationalAgeTabComponent;
  let fixture: ComponentFixture<GestationalAgeTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GestationalAgeTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestationalAgeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

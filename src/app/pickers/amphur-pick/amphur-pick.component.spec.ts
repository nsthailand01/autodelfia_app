import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmphurPickComponent } from './amphur-pick.component';

describe('AmphurPickComponent', () => {
  let component: AmphurPickComponent;
  let fixture: ComponentFixture<AmphurPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmphurPickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmphurPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

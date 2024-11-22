import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionPickComponent } from './position-pick.component';

describe('PositionPickComponent', () => {
  let component: PositionPickComponent;
  let fixture: ComponentFixture<PositionPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionPickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

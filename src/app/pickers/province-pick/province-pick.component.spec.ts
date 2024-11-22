import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvincePickComponent } from './province-pick.component';

describe('ProvincePickComponent', () => {
  let component: ProvincePickComponent;
  let fixture: ComponentFixture<ProvincePickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvincePickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvincePickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

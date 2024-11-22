import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictPickComponent } from './district-pick.component';

describe('DistrictPickComponent', () => {
  let component: DistrictPickComponent;
  let fixture: ComponentFixture<DistrictPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictPickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

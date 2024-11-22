import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddnewRaceComponent } from './addnew-race.component';

describe('AddnewRaceComponent', () => {
  let component: AddnewRaceComponent;
  let fixture: ComponentFixture<AddnewRaceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewRaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RaceListComponent } from './race-list.component';

describe('RaceListComponent', () => {
  let component: RaceListComponent;
  let fixture: ComponentFixture<RaceListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

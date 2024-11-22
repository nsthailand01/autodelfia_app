import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiptScreeningResultTabComponent } from './nipt-screening-result-tab.component';

describe('NiptScreeningResultTabComponent', () => {
  let component: NiptScreeningResultTabComponent;
  let fixture: ComponentFixture<NiptScreeningResultTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiptScreeningResultTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NiptScreeningResultTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

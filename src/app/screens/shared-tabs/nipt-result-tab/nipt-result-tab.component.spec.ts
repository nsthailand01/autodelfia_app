import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiptResultTabComponent } from './nipt-result-tab.component';

describe('NiptResultTabComponent', () => {
  let component: NiptResultTabComponent;
  let fixture: ComponentFixture<NiptResultTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiptResultTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NiptResultTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesListTabComponent } from './samples-list-tab.component';

describe('SamplesListTabComponent', () => {
  let component: SamplesListTabComponent;
  let fixture: ComponentFixture<SamplesListTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SamplesListTabComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesListTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

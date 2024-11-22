import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticResultAmnioticTabComponent } from './diagnostic-result-amniotic-tab.component';

describe('DiagnosticResultAmnioticTabComponent', () => {
  let component: DiagnosticResultAmnioticTabComponent;
  let fixture: ComponentFixture<DiagnosticResultAmnioticTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagnosticResultAmnioticTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticResultAmnioticTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

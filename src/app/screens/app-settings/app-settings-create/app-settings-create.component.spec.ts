import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSettingsCreateComponent } from './app-settings-create.component';

describe('AppSettingsCreateComponent', () => {
  let component: AppSettingsCreateComponent;
  let fixture: ComponentFixture<AppSettingsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSettingsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSettingsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

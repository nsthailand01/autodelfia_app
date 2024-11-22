import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenerateBarcodeExComponent } from './generate-barcode-ex.component';

describe('GenerateBarcodeExComponent', () => {
  let component: GenerateBarcodeExComponent;
  let fixture: ComponentFixture<GenerateBarcodeExComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateBarcodeExComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateBarcodeExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrintLabnoBarcodeComponent } from './print-labno-barcode.component';

describe('PrintLabnoBarcodeComponent', () => {
  let component: PrintLabnoBarcodeComponent;
  let fixture: ComponentFixture<PrintLabnoBarcodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintLabnoBarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintLabnoBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

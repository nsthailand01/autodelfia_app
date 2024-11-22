import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSampleBarcodeComponent } from './get-sample-barcode.component';

describe('GetSampleBarcodeComponent', () => {
  let component: GetSampleBarcodeComponent;
  let fixture: ComponentFixture<GetSampleBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetSampleBarcodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetSampleBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

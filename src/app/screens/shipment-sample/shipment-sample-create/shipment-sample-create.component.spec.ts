import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShipmentSampleCreateComponent } from './shipment-sample-create.component';

describe('ShipmentSampleCreateComponent', () => {
  let component: ShipmentSampleCreateComponent;
  let fixture: ComponentFixture<ShipmentSampleCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentSampleCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentSampleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

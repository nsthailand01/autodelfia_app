import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShipmentSampleListComponent } from './shipment-sample-list.component';

describe('ShipmentSampleListComponent', () => {
  let component: ShipmentSampleListComponent;
  let fixture: ComponentFixture<ShipmentSampleListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentSampleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentSampleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

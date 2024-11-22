import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmsinvoiceListComponent } from './dmsinvoice-list.component';

describe('DmsinvoiceListComponent', () => {
  let component: DmsinvoiceListComponent;
  let fixture: ComponentFixture<DmsinvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmsinvoiceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmsinvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

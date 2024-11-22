import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveCreateComponent } from './objective-create.component';

describe('ObjectiveCreateComponent', () => {
  let component: ObjectiveCreateComponent;
  let fixture: ComponentFixture<ObjectiveCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

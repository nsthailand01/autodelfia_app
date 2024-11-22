import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserAccountListComponent } from './user-account-list.component';

describe('UserAccountListComponent', () => {
  let component: UserAccountListComponent;
  let fixture: ComponentFixture<UserAccountListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import  UserleaveDetailsComponent from './userleave-details.component';

describe('UserleaveDetailsComponent', () => {
  let component: UserleaveDetailsComponent;
  let fixture: ComponentFixture<UserleaveDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserleaveDetailsComponent]
    });
    fixture = TestBed.createComponent(UserleaveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

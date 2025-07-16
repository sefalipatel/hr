import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCompoffWfhListComponent } from './user-compoff-wfh-list.component';

describe('UserCompoffWfhListComponent', () => {
  let component: UserCompoffWfhListComponent;
  let fixture: ComponentFixture<UserCompoffWfhListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserCompoffWfhListComponent]
    });
    fixture = TestBed.createComponent(UserCompoffWfhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

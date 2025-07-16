import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignuserComponent } from './assignuser.component';

describe('AssignuserComponent', () => {
  let component: AssignuserComponent;
  let fixture: ComponentFixture<AssignuserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignuserComponent]
    });
    fixture = TestBed.createComponent(AssignuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

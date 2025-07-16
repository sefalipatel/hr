import { ComponentFixture, TestBed } from '@angular/core/testing';

import  AdmineRequestApprovalComponent  from './admine-request-approval.component';

describe('AdmineRequestApprovalComponent', () => {
  let component: AdmineRequestApprovalComponent;
  let fixture: ComponentFixture<AdmineRequestApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmineRequestApprovalComponent]
    });
    fixture = TestBed.createComponent(AdmineRequestApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

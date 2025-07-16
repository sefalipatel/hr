import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsentPresentApproveFormComponent } from './absent-present-approve-form.component';

describe('AbsentPresentApproveFormComponent', () => {
  let component: AbsentPresentApproveFormComponent;
  let fixture: ComponentFixture<AbsentPresentApproveFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AbsentPresentApproveFormComponent]
    });
    fixture = TestBed.createComponent(AbsentPresentApproveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWfhCompoffViewComponent } from './admin-wfh-compoff-view.component';

describe('AdminWfhCompoffViewComponent', () => {
  let component: AdminWfhCompoffViewComponent;
  let fixture: ComponentFixture<AdminWfhCompoffViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminWfhCompoffViewComponent]
    });
    fixture = TestBed.createComponent(AdminWfhCompoffViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

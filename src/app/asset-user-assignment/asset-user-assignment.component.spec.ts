import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetUserAssignmentComponent } from './asset-user-assignment.component';

describe('AssetUserAssignmentComponent', () => {
  let component: AssetUserAssignmentComponent;
  let fixture: ComponentFixture<AssetUserAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetUserAssignmentComponent]
    });
    fixture = TestBed.createComponent(AssetUserAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

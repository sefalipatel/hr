import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeaveComponentComponent } from './new-leave-component.component';


describe('NewLeaveComponentComponent', () => {
  let component: NewLeaveComponentComponent;
  let fixture: ComponentFixture<NewLeaveComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewLeaveComponentComponent]
    });
    fixture = TestBed.createComponent(NewLeaveComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

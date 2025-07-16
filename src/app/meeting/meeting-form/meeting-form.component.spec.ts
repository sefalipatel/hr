import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingFormComponent } from './meeting-form.component';

describe('MeetingFormComponent', () => {
  let component: MeetingFormComponent;
  let fixture: ComponentFixture<MeetingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MeetingFormComponent]
    });
    fixture = TestBed.createComponent(MeetingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

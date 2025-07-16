import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollVoteDetailComponent } from './poll-vote-detail.component';

describe('PollVoteDetailComponent', () => {
  let component: PollVoteDetailComponent;
  let fixture: ComponentFixture<PollVoteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PollVoteDetailComponent]
    });
    fixture = TestBed.createComponent(PollVoteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

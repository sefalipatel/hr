import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastFormComponent } from './broadcast-form.component';

describe('BroadcastFormComponent', () => {
  let component: BroadcastFormComponent;
  let fixture: ComponentFixture<BroadcastFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BroadcastFormComponent]
    });
    fixture = TestBed.createComponent(BroadcastFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

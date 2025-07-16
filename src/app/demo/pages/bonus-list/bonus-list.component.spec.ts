import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusListComponent } from './bonus-list.component';

describe('BonusListComponent', () => {
  let component: BonusListComponent;
  let fixture: ComponentFixture<BonusListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BonusListComponent]
    });
    fixture = TestBed.createComponent(BonusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

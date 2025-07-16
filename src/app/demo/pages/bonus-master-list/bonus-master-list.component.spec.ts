import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusMasterListComponent } from './bonus-master-list.component';

describe('BonusMasterListComponent', () => {
  let component: BonusMasterListComponent;
  let fixture: ComponentFixture<BonusMasterListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BonusMasterListComponent]
    });
    fixture = TestBed.createComponent(BonusMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

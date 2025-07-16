import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuraceListComponent } from './insurace-list.component';

describe('InsuraceListComponent', () => {
  let component: InsuraceListComponent;
  let fixture: ComponentFixture<InsuraceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InsuraceListComponent]
    });
    fixture = TestBed.createComponent(InsuraceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationListComponent } from './resignation-list.component';

describe('ResignationListComponent', () => {
  let component: ResignationListComponent;
  let fixture: ComponentFixture<ResignationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResignationListComponent]
    });
    fixture = TestBed.createComponent(ResignationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

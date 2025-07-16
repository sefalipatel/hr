import { ComponentFixture, TestBed } from '@angular/core/testing';

import TitlePopUpComponent  from './title-pop-up.component';

describe('TitlePopUpComponent', () => {
  let component: TitlePopUpComponent;
  let fixture: ComponentFixture<TitlePopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TitlePopUpComponent]
    });
    fixture = TestBed.createComponent(TitlePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

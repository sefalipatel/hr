import { ComponentFixture, TestBed } from '@angular/core/testing'; 
import HolidaycardComponent from './holiday-card.component';

describe('HolidaycardComponent', () => {
  let component: HolidaycardComponent;
  let fixture: ComponentFixture<HolidaycardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HolidaycardComponent]
    });
    fixture = TestBed.createComponent(HolidaycardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

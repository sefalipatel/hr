import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacedetectionComponent } from './facedetection.component';

describe('FacedetectionComponent', () => {
  let component: FacedetectionComponent;
  let fixture: ComponentFixture<FacedetectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FacedetectionComponent]
    });
    fixture = TestBed.createComponent(FacedetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

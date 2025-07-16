import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacedetectionNewComponent } from './facedetection-new.component';

describe('FacedetectionNewComponent', () => {
  let component: FacedetectionNewComponent;
  let fixture: ComponentFixture<FacedetectionNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FacedetectionNewComponent]
    });
    fixture = TestBed.createComponent(FacedetectionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

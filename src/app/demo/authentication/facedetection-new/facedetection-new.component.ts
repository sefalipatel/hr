import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facedetection-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facedetection-new.component.html',
  styleUrls: ['./facedetection-new.component.scss']
})
export class FacedetectionNewComponent {


  showSecondScreen = false;

  toggleScreen() {
    this.showSecondScreen = !this.showSecondScreen;
  } 
}

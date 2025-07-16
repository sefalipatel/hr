import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgClass, NgFor } from '@angular/common'; 
import { CommonModule } from '@angular/common';

import { FaceMesh, FACEMESH_TESSELATION } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

@Component({
  selector: 'app-employee-webcam',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, CommonModule],
  templateUrl: './employee-webcam.component.html',
  styleUrls: ['./employee-webcam.component.scss']
})
export class EmployeeWebcamComponent implements OnInit, OnDestroy {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') overlayRef!: ElementRef<HTMLCanvasElement>;

  @Input() set requestId(id: string) { this._requestId = id; }
  get requestId() { return this._requestId; }
  private _requestId!: string;

  empName = '';
  empCode = '';
  empID = '';
  statusMsg = 'Initializing...';
  progress = 0;
  isCapturing = false;
  isFacePresent = false;
  multipleFacesDetected = false;
  progressColor = 'bg-warning';
  stopDetection = false;
  captureStarted = false;

  hasExistingImages = false;
  private hasExistingImagess = false;

  private images: string[] = [];
  private readonly imageCount = 50;
  private mediaStream: MediaStream | null = null;
  private captureTimeoutId: any = null;

  private faceMesh!: FaceMesh;
  private camera!: Camera;
  private lastYaw: number | null = null;
  private lastPitch: number | null = null;
  private directionCount = 0;
  private capturePausedByWrongMotion = false;


  constructor(
    private svc: CommonService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async params => {
      if (!this._requestId) this._requestId = params['id'];
      try {
        await this.getUserData();
        await this.checkExistingImages();
      } catch {
        this.statusMsg = 'Initialization failed.';
      }
    });
  }

  ngOnDestroy() {
    this.stopCamera();
    if (this.captureTimeoutId) clearTimeout(this.captureTimeoutId);
  }

  goBack() {
    this.router.navigate(['employee-details']);
  }

  recapture() {
    this.hasExistingImages = false;
    this.stopDetection = false;
    this.statusMsg = 'Re-initializing face detection...';
    this.loadModelsAndStart();
  }


    private getUserData(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.svc.get(`Person/${this.requestId}`).subscribe({
          next: (res) => {
            this.empName = res?.value?.firstName + ' ' + res?.value?.lastName;
            this.empCode = res?.value?.personCode;
            this.empID = res?.value?.id;
            this.hasExistingImagess = res?.value?.isCaptured;
            resolve(); // only resolve once empCode is set
          },
          error: (err) => {
            console.error('Failed to get user data:', err);
            reject(err);
          }
        });
      });
    }

  private async checkExistingImages() {
    this.hasExistingImages = this.hasExistingImagess;
    if (this.hasExistingImages) {
      this.statusMsg = `Face already captured for ${this.empName}.`;
      this.stopDetection = true;
    } else {
      this.statusMsg = 'No existing images found. Initializing face detection.';
      await this.loadModelsAndStart();
    }
  }

  private async loadModelsAndStart() {
    this.statusMsg = 'Loading Models...'; 
    await this.startCamera();
    await this.initFaceMesh();
    this.statusMsg = 'Please move head left↔right then up↕down to start.';
  }

  private async startCamera() {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const v = this.videoRef.nativeElement;
    v.srcObject = this.mediaStream;
    await v.play();
  }

  private stopCamera() {
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.mediaStream = null;
    this.camera?.stop();
  }

  private async initFaceMesh() {
    this.faceMesh = new FaceMesh({ locateFile: f => `/assets/mediapipe/${f}` });
    this.faceMesh.setOptions({
      selfieMode: true, maxNumFaces: 2,
      refineLandmarks: false, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5
    });
    this.faceMesh.onResults(res => this.onFaceMeshResults(res));
    this.camera = new Camera(this.videoRef.nativeElement, {
      onFrame: async () => await this.faceMesh.send({ image: this.videoRef.nativeElement }),
      width: 640, height: 480
    });
    await this.camera.start();
  }

  private getMovementInstruction(): string {
    if (this.images.length < 25) {
      return 'Move face slowly from LEFT ↔ RIGHT';
    } else if (this.images.length < this.imageCount) {
      return 'Now move face from TOP ↕ DOWN';
    } else {
      return 'Capture complete. Processing images...';
    }
  }

  private onFaceMeshResults(results: any) {
    if (this.stopDetection) return;

    const video = this.videoRef.nativeElement;
    const canvas = this.overlayRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const lmsArr = results.multiFaceLandmarks;

    // Update face presence flags
    const faceCount = lmsArr?.length ?? 0;

    this.ngZone.run(() => {
      this.isFacePresent = faceCount === 1;
      this.multipleFacesDetected = faceCount > 1;

      if (this.multipleFacesDetected) {
        this.statusMsg = 'Multiple faces detected – only one allowed.';
        this.pauseCapture();
        return;
      }

      if (!this.isFacePresent) {
        this.statusMsg = 'No face detected – align your face.';
        this.pauseCapture();
        return;
      }

      if (this.captureStarted && !this.isCapturing && !this.capturePausedByWrongMotion) {
        this.resumeCapture();
      }

      const lm = lmsArr![0];
      drawConnectors(ctx, lm, FACEMESH_TESSELATION, { color: '#0f0', lineWidth: 0.05 });
      drawLandmarks(ctx, lm, { color: '#f00', fillColor: '#f00', radius: 0.01 });

      const nose = lm[1], leftC = lm[234], rightC = lm[454];
      const yaw = rightC.x - leftC.x;
      const pitch = nose.y - (leftC.y + rightC.y) / 2;

      if (this.lastYaw === null) this.lastYaw = yaw;
      if (this.lastPitch === null) this.lastPitch = pitch;

      const movedYaw = Math.abs(yaw - this.lastYaw) > 0.015;
      const movedPitch = Math.abs(pitch - this.lastPitch) > 0.015;

      const currentPhase = this.images.length < this.imageCount / 2 ? 'yaw' : 'pitch';

      if (this.isCapturing || !this.isCapturing && this.capturePausedByWrongMotion === true || !this.isCapturing && !this.capturePausedByWrongMotion) {
        if (currentPhase === 'yaw') {
          if (movedYaw) {
            this.lastYaw = yaw;
            if (this.capturePausedByWrongMotion) this.resumeCapture();
          } else if (movedPitch && this.isCapturing) {
            this.pauseCapture(true);
            this.statusMsg = 'Wrong movement! Move LEFT ↔ RIGHT only.';
          }
        } else if (currentPhase === 'pitch') {
          if (movedPitch) {
            this.lastPitch = pitch;
            if (this.capturePausedByWrongMotion) this.resumeCapture();
          } else if (movedYaw && this.isCapturing) {
            this.pauseCapture(true);
            this.statusMsg = 'Wrong movement! Move UP ↕ DOWN only.';
          }
        }
      }

      if (!this.isCapturing) {
        this.statusMsg = this.getMovementInstruction();
      }
    });
  }

  private pauseCapture(byWrongMotion: boolean = false) {
    this.isCapturing = false;
    this.progressColor = 'bg-warning';
    this.capturePausedByWrongMotion = byWrongMotion;
    clearTimeout(this.captureTimeoutId);
  }

  private resumeCapture() {
    if (this.isCapturing) return; // Already running
    this.capturePausedByWrongMotion = false;
    this.isCapturing = true;
    this.statusMsg = this.getMovementInstruction() + ' (Resuming capture...)';
    this.captureTimeoutId = setTimeout(() => this.captureLoop(), 1000);
  }


  startCapture() {
    this.captureStarted = true;
    this.lastYaw = null;
    this.lastPitch = null;

    if (!this.isFacePresent || this.multipleFacesDetected || this.isCapturing) return;

    this.isCapturing = true;
    this.progressColor = 'bg-info';
    this.images = [];
    this.progress = 0;
    this.directionCount = 0;
    this.statusMsg = `Starting capture of ${this.imageCount} images...`;

    this.captureLoop();
  }

  private captureLoop() {
    if (!this.isFacePresent || this.multipleFacesDetected) {
      this.pauseCapture();
      return;
    }

    if (this.images.length >= this.imageCount) {
      return this.finalizeCapture();
    }

    const currentPhase = this.images.length < this.imageCount / 2 ? 'yaw' : 'pitch';

    // Ensure movement is happening in the correct direction
    if ((currentPhase === 'yaw' && this.lastYaw === 0) || 
        (currentPhase === 'pitch' && this.lastPitch === 0)) {
      // Wait until movement is detected
      this.captureTimeoutId = setTimeout(() => this.captureLoop(), 500);
      return;
    }

    this.captureFrame();
    this.progress = Math.round((this.images.length / this.imageCount) * 100);
    this.statusMsg = `Capturing image...`;

    this.captureTimeoutId = setTimeout(() => this.captureLoop(), 1000);
  }


  private finalizeCapture() {
    this.isCapturing = false;
    this.progressColor = 'bg-success';
    this.statusMsg = 'All images captured. Uploading…';
    this.stopCamera();
    this.stopDetection = true;
    const payload = {
        name: this.empName,
        PersonId: this.empID,
        person_code: this.empCode,
        images: this.images
      };
    fetch(`${this.svc.face_recognitionUrl}/save-person-image/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => { this.statusMsg = 'Upload successful!'; this.svc.showToast('Uploaded Successfully!', ToastType.SUCCESS, ToastType.SUCCESS); })
      .catch(err => { this.statusMsg = 'Upload failed: ' + err; this.svc.showToast('Upload failed: ' + err, ToastType.ERROR, ToastType.ERROR); });
  }

  private captureFrame() {
    const video = this.videoRef.nativeElement;
    const c = document.createElement('canvas');
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(video, 0, 0);
    this.images.push(c.toDataURL('image/jpeg'));
  }
}

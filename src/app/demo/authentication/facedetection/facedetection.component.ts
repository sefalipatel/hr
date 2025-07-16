import { Component, ElementRef, OnInit, ViewChild, OnDestroy, NgZone, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
// import * as faceapi from 'face-api.js';
@Component({
  selector: 'app-facedetection',
  standalone: true,
  imports: [CommonModule, MatTabsModule, HttpClientModule, MatStepperModule, FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,],
  templateUrl: './facedetection.component.html',
  styleUrls: ['./facedetection.component.scss'],
  encapsulation: ViewEncapsulation.None,

  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class FacedetectionComponent implements OnInit, OnDestroy {

  // Duplicate @ViewChild declarations removed
  private videoStream: MediaStream | null = null;

  constructor(
    private http: HttpClient,
    private svc: CommonService,
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    // this.initFaceDetection();
    this.startCamera();
    this.selectedTabIndex = this.FaceRecog ? 0 : 1;
  }

  detectionActive = true;
  showSpinner = false;
  FaceRecog = true;
  showQR = false;
  isVerified = false;
  selectedTabIndex: number = 0;
  qrCodeUrl = null;
  otpCode: string = '';

  // async initFaceDetection(): Promise<void> {
  //   try {
  //     this.showSpinner = true;
  //     await this.loadModels();
  //     await this.startCamera();
  //     setTimeout(() => this.detectFaces(), 1500); // Begin loop
  //   } catch (err) {
  //     this.svc.showToast('Initialization failed', 'Face Detection', ToastType.ERROR);
  //     this.showSpinner = false;
  //   }
  // }


  // private async loadModels() {
  //   await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
  // }

  startCamera(): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.videoStream = stream;
          const video = this.videoElement.nativeElement;
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            resolve();
          };
        })
        .catch((error) => {
          console.error('Camera access denied or error:', error);
          reject(error);
        });
    });
  }

  // async detectFaces(): Promise<void> {
  //   if (!this.detectionActive) return;

  //   const video = this.videoElement.nativeElement;
  //   const canvas = this.canvasElement.nativeElement;

  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;

  //   try {
  //     const detections = await faceapi.detectAllFaces(
  //       video,
  //       new faceapi.TinyFaceDetectorOptions()
  //     );

  //     if (!this.detectionActive) return;

  //     if (detections.length === 1) {
  //       this.captureImage(); // This will stop detectionActive on success
  //     } else {
  //       const message = detections.length === 0
  //         ? 'No face detected!'
  //         : 'Multiple faces detected!';
  //       this.svc.showToast(message, 'Face Detection', ToastType.ERROR);
  //       setTimeout(() => this.detectFaces(), 1500); // Keep scanning
  //     }
  //   } catch (error) {
  //     console.error('Face detection error:', error);
  //     this.svc.showToast('Detection error. Trying again...', 'Face Detection', ToastType.ERROR);
  //     setTimeout(() => this.detectFaces(), 1500); // Keep scanning on error
  //   }
  // }

QRauth(): void{
  this.FaceRecog =false;
  this.selectedTabIndex = this.FaceRecog ? 0 : 1;
  console.log("QR code");
  
  const emailparam = localStorage.getItem('userEmail');
  fetch(`${this.svc.face_recognitionUrl}/otp-verify/?user_email=${emailparam}`, {
    method: 'GET'
  })
  .then(async response => {
    if (!response.ok) throw new Error(`Verification failed with status: ${response.status}`);
    const value = await response.json();

    if(value?.is_verified === true){
      this.isVerified = true;
      this.showQR = false;
    }
    else if(value?.is_verified === false){
      this.getQR();
    }
  })
  .catch(err => {
    console.error('Error during verification:', err);
  })
  .finally(() => {
    // Any final cleanup if needed
  });

}

getQR(): void{
  const emailparam = localStorage.getItem('userEmail');
  if (!emailparam) {
    console.error('Missing user email in local storage.');
    return;
  }

  const payload = {
    user_email: emailparam
  };
  fetch(`${this.svc.face_recognitionUrl}/qrcode/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(async response => {
    if (!response.ok) throw new Error(`QR generation failed with status: ${response.status}`);

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // JSON response
      const value = await response.json();

      if (value?.message === "2FA already verified or not required") {
        this.isVerified = true;
      }
      
    } else if (contentType.includes('image/png')) {
      // PNG image response (QR code)
      const blob = await response.blob();
      this.showQR=true;
      this.qrCodeUrl = URL.createObjectURL(blob); // Save URL to display image in template
    } else {
      throw new Error('Unexpected content type: ' + contentType);
    }
  })
  .catch(err => {
    console.error('Error during OTP verification:', err);
  })
  .finally(() => {
    // Any final cleanup if needed
  });
}

OTPverify() {
  const email = localStorage.getItem('userEmail');
  const guid_id = localStorage.getItem('encryptionId');

  if (!this.otpCode || this.otpCode.length !== 6) {
    this.svc.showToast('Please enter a valid 6-digit OTP.', 'Wrong OTP', ToastType.ERROR);
    return;
  }

  const payload = {
    user_email: email,
    otp_code: this.otpCode,
    PersonId: guid_id
  };

  fetch(`${this.svc.face_recognitionUrl}/otp-verify/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(async response => {
      if (!response.ok) throw new Error(`OTP verification failed with status: ${response.status}`);
      
      const value = await response.json();

      if (value?.error === "Invalid or expired OTP") {
        this.svc.showToast('Invalid or expired OTP', 'Wrong OTP', ToastType.ERROR);
        return;
      }
      this.detectionActive = false;

        const decoded = jwtDecode(value?.token) as { organizationId: string };
        const role = jwtDecode(value?.token) as { roleName: string };

        localStorage.setItem('token', value.token);
        localStorage.setItem('orgId', decoded?.organizationId);
        localStorage.setItem('roleName', role?.roleName);
        const userInfo = {
          name: value?.personName,
          email: value?.email,
          username: value?.personName,
          personID: value?.personId,
          token: value?.token,
          personRole: value?.personRole,
          loginType: value?.loginType,
        };
        localStorage.setItem("LastCheckInOutStatus", JSON.stringify(value?.lastCheckInOutStatus));
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('userRole', JSON.stringify(value));

        const IsPolicyConcern = JSON.parse(localStorage.getItem('userRole') || '{}').isPolicyConsent;

        this.svc.showToast('Recognition Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);

        this.videoStream?.getTracks().forEach(track => track.stop());
        this.videoElement.nativeElement.srcObject = null;

      if (!IsPolicyConcern) {
        this.router.navigate(['/company-policy']);
      } else {
        this.zone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      }
    })
    .catch(err => {
      console.error('OTP verification failed:', err);
      this.svc.showToast('OTP verification failed. Please try again.', 'Wrong OTP', ToastType.ERROR);
    });
}


  captureImage(): void {
    if (!this.videoStream) {
      this.svc.showToast('Camera Error!', 'Face Detection', ToastType.ERROR);
      return;
    }

    this.showSpinner = true;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Canvas context is not available.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

    const employee_code = localStorage.getItem('personCode');
    const guid_id = localStorage.getItem('encryptionId');

    if (!employee_code || !guid_id) {
      console.error('Missing employee_code or guid_id in local storage.');
      return;
    }

    const payload = {
      PersonCode: employee_code,
      PersonId: guid_id,
      Image: base64Image
    };

    fetch(`${this.svc.face_recognitionUrl}/twofactor-authentication/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async response => {
        if (!response.ok) throw new Error(`Recognition failed with status: ${response.status}`);
        const value = await response.json();

        this.detectionActive = false;

        const decoded = jwtDecode(value?.token) as { organizationId: string };
        const role = jwtDecode(value?.token) as { roleName: string };

        localStorage.setItem('token', value.token);
        localStorage.setItem('orgId', decoded?.organizationId);
        localStorage.setItem('roleName', role?.roleName);
        const userInfo = {
          name: value?.personName,
          email: value?.email,
          username: value?.personName,
          personID: value?.personId,
          token: value?.token,
          personRole: value?.personRole,
          loginType: value?.loginType,
        };
        localStorage.setItem("LastCheckInOutStatus", JSON.stringify(value?.lastCheckInOutStatus));
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('userRole', JSON.stringify(value));

        const IsPolicyConcern = JSON.parse(localStorage.getItem('userRole') || '{}').isPolicyConsent;

        this.svc.showToast('Recognition Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);

        this.videoStream?.getTracks().forEach(track => track.stop());
        this.videoElement.nativeElement.srcObject = null;

      if (!IsPolicyConcern) {
        this.router.navigate(['/company-policy']);
      } else {
        this.zone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      }
    })
    .catch(err => {
      console.error('Recognition API failed:', err);
      this.QRauth()
      this.svc.showToast('Face recognition failed!', 'Face Detection', ToastType.ERROR);
      if(this.detectionActive)
        this.detectionActive=false;
    })
    .finally(() => {
      this.showSpinner = false;
    });
}

stopCamera() {
  if (this.videoStream) {
    this.videoStream.getTracks().forEach(track => track.stop());
    this.videoStream = null;
  }
  this.videoElement.nativeElement.srcObject = null;
}

onTabChange(index: number) {
  if (index === 0) {
    this.startCamera();
  } else if(index === 1){
    this.QRauth();
    this.stopCamera();
  }
}


  ngOnDestroy(): void {
    this.detectionActive = false;
    this.stopCamera();
  }

  showSecondScreen = false;

  toggleScreen() {
    this.showSecondScreen = !this.showSecondScreen;
  }
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>; 

}

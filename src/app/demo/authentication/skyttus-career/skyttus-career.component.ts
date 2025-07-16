import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastType } from 'src/app/service/common/common.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ApiService } from 'src/app/api.service';
import { CaptchaImage } from './model/captcha.model';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { HttpClient } from '@angular/common/http';
import { LoaderComponent } from "../../../loader/loader.component";
@Component({
  selector: 'app-skyttus-career',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule, LoaderComponent],
  templateUrl: './skyttus-career.component.html',
  styleUrls: ['./skyttus-career.component.scss']
})
export class SkyttusCareerComponent implements OnInit {
  jobapplyform: FormGroup;
  File: File | undefined;
  documentId: string;
  ismessagedisplay: boolean = false;
  loading: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _commonService: CommonService,
    private apiService: ApiService,
    private route: Router,
    private api: CommonService,
    private Activatedroute: ActivatedRoute,
    private _http: HttpClient
  ) {
    this.jobapplyform = this.buildForm(); 
  }
  ngOnInit(): void {
    this.generateCaptcha();
  }
  buildForm() {
    return this._fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      isActive: [false],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      location: ['', [Validators.required]],
      positionOfInterest: ['', [Validators.required]],
      cv: ['', [Validators.required]],
      message: ['', [Validators.required]],
      captcha: ['', [Validators.required]]
    });
  }
  OnSelectedFile(e) {
    const file = e.target.files[0]; 
    this.jobapplyform.controls['cv']?.setValue(file);
    this.File = file;
  }
  Save(event) {
    if (this.jobapplyform.invalid) {
      this.jobapplyform.markAllAsTouched();
      return;
    } 
    if (this.jobapplyform.valid) {
      this.jobapplyform.markAllAsTouched(); 
      const formData: FormData = new FormData();
      formData.append('fullName', this.jobapplyform.get('fullName').value);
      formData.append('email', this.jobapplyform.get('email').value);
      formData.append('cv', this.jobapplyform.get('cv').value);
      formData.append('positionOfInterest', this.jobapplyform.get('positionOfInterest').value);
      formData.append('location', this.jobapplyform.get('location').value);
      formData.append('message', this.jobapplyform.get('message').value);
      formData.append('phoneNumber', this.jobapplyform.get('phoneNumber').value);
      formData.append('captcha', this.jobapplyform.get('captcha').value);
      this.api.post(`JobInquiry`, formData).subscribe((res) => {
        
        if (res?.value?.cvFile && res?.value?.id) {
          const path = res.value.cvFile;
          const resumeId = res.value.id;

          this.saveCV(path, resumeId);

          this.api.showToast('JobInquiry Save Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS); 
          this.ismessagedisplay = true;
          this.jobapplyform.reset();
          this.File = null;
        }
      });
    } else {
      this.jobapplyform.markAllAsTouched();
    }
    event.stopPropagation();
  }

  // captcha code
  public captchaImage: any;
  public captchaString!: string;
  userInput!: string;

  generateCaptcha() {
    const captchaCode = this.generateCaptchaCode(6); // Generate a random 6-character Captcha code
    const captchaImage = new CaptchaImage(150, 50, captchaCode); // Create a new CaptchaImage instance with the code and dimensions
    this.captchaImage = captchaImage.generateImage();
  }

  generateCaptchaCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$#';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    this.captchaString = code;
    return this.captchaString;
  }

  validateCaptcha() {
    if (this.jobapplyform.valid && this.jobapplyform.value.captcha === this.captchaString) {
    } else {
      this.generateCaptchaCode(6);
    }
  }

  async saveCV(tempPath: string, resumeId: string): Promise<void> {
    const payload = { path: tempPath, resumeid: resumeId };
    try {
      this.loading = true;
      await this.api.postpy('/process-path/', payload).toPromise();
      this.loading = false;
    } catch (error) {
      console.error('Error calling Python API:', error);
    }
  }
}

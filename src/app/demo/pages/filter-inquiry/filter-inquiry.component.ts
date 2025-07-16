import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonService } from 'src/app/service/common/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { LoaderComponent } from '../../../loader/loader.component';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [SharedModule, MatIconModule, MatInputModule, MatFormFieldModule, MatExpansionModule, LoaderComponent],
  selector: 'app-filter-inquiry',
  templateUrl: './filter-inquiry.component.html',
  styleUrls: ['./filter-inquiry.component.scss']
})
export class FilterInquiryComponent implements OnInit {
  filterForm: FormGroup;
  matchingResumes: { resumeId: string; fullName: string; matchingScore: number }[] = [];
  resumeDetailsMap: { [resumeId: string]: any } = {};
  expandedResumeId: string | null = null;
  loading: boolean = false;

  constructor(
    private api: CommonService,
    private _fb: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.buildForm();
  }

  ngOnInit(): void {}

  buildForm() {
    return this._fb.group({
      jobTitle: ['', Validators.required],
      location: [''],
      yearOfExperience: ['', [Validators.pattern(/^\d+$/)]],
      skills: [''],
      qualification: ['']
    });
  }
  goBack() {
    this.router.navigate(['jobinquiry']);
  }
  getResumeDetails(resumeId: string): void {
    if (this.expandedResumeId === resumeId) {
      this.expandedResumeId = null;
      return;
    }

    if (this.resumeDetailsMap[resumeId]) {
      this.expandedResumeId = resumeId;
      return;
    }

    this.api.getpy(`/resume/${resumeId}/insights/`).subscribe({
      next: (detail) => {
        this.resumeDetailsMap[resumeId] = this.mapResumeDetail(detail);
        this.expandedResumeId = resumeId;
      },
      error: (err) => console.error('Error fetching resume detail:', err)
    });
  }

  mapResumeDetail(detail: any): any {
    const mapped: any = {};
    detail.forEach((item: any) => {
      const label = item.label.toLowerCase(); 
      if (label.includes('years')) mapped.experience = item.value;
      else if (label.includes('skill')) mapped.skills = item.value;
      else if (label.includes('tech')) mapped.technology = item.value;
      else if (label.includes('level')) mapped.experienceLevel = item.value;
    });
    return mapped;
  }

  findCV() {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    const formValue = this.filterForm.value;
    const payload = {
      job_title: formValue.jobTitle,
      location: formValue.location,
      years_exp: formValue.yearOfExperience,
      Skills: formValue.skills,
      Qualifications: formValue.qualification
    };

    this.api.postpy('/find-matches/', payload).subscribe({
      next: (response) => {
        const matches = response.matches || [];

        const uniqueMap = new Map<string, { fullName: string; matchingScore: number }>();

        matches.forEach((r: any) => {
          if (!uniqueMap.has(r.resumeid)) {
            uniqueMap.set(r.resumeid, {
              fullName: r.fullname,
              matchingScore: r.score
            });
          }
        });

        this.matchingResumes = Array.from(uniqueMap.entries())
          .map(([resumeId, data]) => ({
            resumeId: resumeId,
            fullName: data.fullName,
            matchingScore: data.matchingScore
          }))
          .sort((a, b) => b.matchingScore - a.matchingScore)
          .slice(0, 5);

        this.resumeDetailsMap = {};
        this.expandedResumeId = null;
      },
      error: (error) => {
        console.error('Error finding matches:', error);
      }
    });
  }

  cleanForm() {
    this.filterForm.reset();
    this.matchingResumes = [];
    this.resumeDetailsMap = {};
    this.expandedResumeId = null;
  }
}

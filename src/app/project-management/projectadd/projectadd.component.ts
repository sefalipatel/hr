import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule, formatDate } from '@angular/common';
import { ApiService } from 'src/app/api.service';
import { ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';

export interface Project {
  id: string;
  projectName: string;
  projectCategoryId: string;
  projectManager: { id: string; employeeName: string };
  projectOwner: { personId: string; employeeName: string };
  startDate: string;
  endDate: string;
  description: string;
  technologySpecification: string;
  clientName: string;
  clientContactNumber: string;
  clientEmail: string;
  externalStakeholders: string;
  status: Number;
  priority: number;
  notes: string;
  projectAttachments: string;
}
@Component({
  selector: 'app-projectadd',
  templateUrl: './projectadd.component.html',
  styleUrls: ['./projectadd.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTabsModule
  ]
})
export class ProjectaddComponent {
  projectForm: FormGroup;
  isView?: boolean;
  onlyFileType = '.png, .jpg, .jpeg, .pdf , .docx , .doc , .xlsx';
  selectedFiles: File[];
  filelist: any = [];
  uploadedFiles = [];
  uploadfilelist: any = [];
  deletefile: any = [];
  projectCategoryData: any = [];
  personDate: any = [];
  selectedCategory: string = '';
  selectedCategoryName: string = '';
  selectedManager: string = '';
  selectedOwner: string = '';
  public isSubmitted: boolean;
  id: string = '';
  projectData: Project;
  title: string;
  buttonName: string = 'Save';
  nexttab: boolean = false;
  selectedIndex: number = 0;
  startDate: string = '';
  date = new Date();
  clentGetAllData: any;
  selectedClient: any;
  isSubmitting: boolean = false; 
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    private api: CommonService
  ) {
    this.projectForm = this._fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      projectCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      projectCategoryId: ['', [Validators.required]],
      projectManager: ['', [Validators.required]],
      projectOwner: ['', Validators.required],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      description: ['', [Validators.required]],
      technologySpecification: ['', [Validators.required]],
      status: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      notes: [''],
      clientId: ['', [Validators.required]],
      projectAttachments: ['']
    });
  }

  async ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? ''; 
    this.personDate = await this.apiService.getPerson();
    this.getAllClient();
    this.getAllPerson();
    this.projectCategoryData = await this.apiService.getProjectCategory();
    this.id = this.activeRoute.snapshot.params['id'] ?? ''; 
    if (this.id) {
      this.title = 'Update project';
      this.buttonName = 'Update';
      let data = await this.apiService.getProjectById(this.id);
      this.projectData = data.value;
      this.uploadedFiles = data.value.projectAttachment;
      this.uploadedFiles?.map((row, index) => {
        this.uploadfilelist.push(row.path.split('\\').pop());
      });
      this.onProjectCategorySelected(this.projectData?.projectCategoryId);
      this.projectForm.patchValue({
        ...this.projectData,
        projectManager: this.projectData.projectManager?.id ?? '',
        projectOwner: this.projectData.projectOwner?.personId ?? ''
      });
    }
  } 
  getAllPerson() {
    this.api.get(`Person/listemployee`).subscribe((res) => {
      this.personDate = res;
    });
  }
  get projectFormControl() {
    return this.projectForm.controls;
  }
  getAllClient() {
    this.api.get(`Client`).subscribe((x) => {
      this.clentGetAllData = x;
    });
  }

  onProjectCategorySelected(id) {
    this.selectedCategory = id;

    const selectedCategory = this.projectCategoryData.find((x) => x.id === id);
    if (selectedCategory) {
      this.selectedCategoryName = selectedCategory.name;
    }
  }
  onclientSelected(id) {
    this.selectedClient = id;
  }

  onProjectManagerSelected(id) {
    this.selectedManager = id;
  }
  onProjectOwnerSelected(id) {
    this.selectedOwner = id;
  }

  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.selectedFiles = event.target.files;
    for (let i = 0; i < event.target.files; i++) {
      this.selectedFiles.push(event.target.files[i]);
    }
    if (this.selectedFiles.length > 0) {
      for (const row of this.selectedFiles) {
        this.filelist.push(row);
      }
    }
  }

  //file delete
  fileDelete(i, Type) {
    if (Type == 0) {
      this.uploadfilelist = this.uploadfilelist.filter((item, index) => index != i);
      this.uploadedFiles.filter((item, index) => {
        if (index != i) {
        } else {
          this.api.delete(`ProjectManagement/projectId/` + item.projectId + '/attachmentId/' + item.id).subscribe((res) => {
            this.api.showToast('File Deleted Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS);
          });
          this.deletefile.push(item.id);
        }
      });
    } else {
      this.filelist = this.filelist.filter((item, index) => index != i);
    }
  }

  //add project
  async createProject() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    const formData: FormData = new FormData();
    for (const row of this.filelist) {
      formData.append('AttachmentFiles', row);
    }

    if (
      this.selectedCategoryName.toLocaleLowerCase() === 'client' &&
      this.projectForm.get('clientId').value != '00000000-0000-0000-0000-000000000000'
    ) {
      formData.append('clientId', this.projectForm.get('clientId').value);
    }
    formData.append('OrganizationId', localStorage.getItem('orgId')),
      formData.append('ProjectName', this.projectForm.get('projectName').value),
      formData.append('ProjectCode', this.projectForm.get('projectCode').value),
      formData.append('Description', this.projectForm.get('description').value),
      formData.append('StartDate', formatDate(this.projectForm.get('startDate').value, 'yyyy-MM-dd', 'en-US', '+0530')),
      formData.append('EndDate', formatDate(this.projectForm?.get('endDate').value, 'yyyy-MM-dd', 'en-Us', '+0530')),
      formData.append('TechnologySpecification', this.projectForm.get('technologySpecification').value),
      formData.append('Status', this.projectForm.get('status').value),
      formData.append('Priority', this.projectForm.get('priority').value),
      formData.append('ProjectCategoryId', this.projectForm.get('projectCategoryId').value),
      formData.append('ProjectManager', this.projectForm.get('projectManager').value),
      formData.append('ProjectOwner', this.projectForm.get('projectOwner').value),
      formData.append('Notes', this.projectForm.get('notes').value ?? '');
    if (this.id != '') {
      formData.append('id', this.id);
      let result = await this.apiService.updateProject(formData);
      if (result) this.api.showToast('Project Details Updated Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS);
      this.isSubmitting = false;
      this.navigate();
    } else {
      let result = await this.apiService.addProject(formData);
      if (result) {
        this.api.showToast('Project Details Added Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSubmitting = false;
        this.navigate();
      }
    }
  }

  dateSelect() {
    this.startDate = this.projectForm.get('startDate').value;
  }

  navigate() {
    this.router.navigateByUrl('/project-dashboard');
  }
  next() {
    if (this.projectForm.invalid && !this.projectForm.get('projectName').value) {
      this.projectForm.markAllAsTouched();
      return;
    }
  }

  async cancel() {
    this.router.navigateByUrl('/project-dashboard');
  }

  trimNameOnBlur(controlName: string) {
    const control = this.projectForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
}

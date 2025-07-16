import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';

export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2
}

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent {
  ticketForm: FormGroup;
  ticketId: string = '';
  isSubmitting: boolean = false;
  employeeRecords: any[] = [];
  clientRecords: any[] = [];
  projectList: any[] = [];
  public priorityList = [
    {
      name: 'High',
      value: Priority.High
    },
    {
      name: 'Medium',
      value: Priority.Medium
    },
    {
      name: 'Low',
      value: Priority.Low
    }
  ];
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _commonService: CommonService,
    private datePipe: DatePipe
  ) {
    this.ticketForm = this.buildForm();
    this.ticketForm.get('priority')?.setValue(Priority.Low);
  }

  buildForm() {
    return this._fb.group({
      subject: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      description: ['', [Validators.required]],
      clientId: [''],
      projectId: [''],
      dueDate: [''],
      assignedId: ['']
    });
  }

  public get getTicketFormControl() {
    return this.ticketForm.controls;
  }

  ngOnInit() {
    this.getTicketById();
    this.getAllEmployee();
    this.getAllProject();
    this.getAllClient();
  }

  getTicketById() {
    this.ticketId = this.activeRoute?.snapshot?.params['id'];

    if (this.ticketId) {
      this._commonService.get(`ticket/${this.ticketId}`).subscribe((res) => {
        this.ticketForm.patchValue(res?.value[0]);
      });
    }
  }
  getAllEmployee() {
    this._commonService.get(`Person/listemployee`).subscribe((res) => {
      this.employeeRecords = res;
    });
  }

  getAllProject() {
    this._commonService.get(`ProjectManagement`).subscribe((res) => {
      this.projectList = res;
    });
  }

  getAllClient() {
    this._commonService.get(`Client`).subscribe((res) => {
      this.clientRecords = res;
    });
  }

  getProjectByClient(id: any) {
    if (id?.value) {
      this._commonService.get(`projectManagement/clientProject/${id?.value}`).subscribe((res) => {
        this.projectList = res;
      });
    } else {
      this.getAllProject();
    }
  }
  addTicket() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;

    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }
    const formattedDate = this.datePipe.transform(this.ticketForm.value.dueDate, 'yyyy-MM-ddTHH:mm:ss');
    this.ticketForm.patchValue({ dueDate: formattedDate });

    let payload = { ...this.ticketForm.value, id: this.ticketId };

    if (this.ticketId) {
      this._commonService.put(`Ticket`, payload).subscribe(
        (res) => {
          if (res?.statusCode === 200) {
            this._commonService.showToast('Ticket Updated Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
            this.isSubmitting = false;
            this.ticketForm.reset(); 
            this.router.navigate(['ticket-new']);
          } else {
            this._commonService.showToast(res?.message, ToastType.ERROR, ToastType.ERROR);
          }
        },
        (err) => {
          this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    } else {
      this._commonService.post(`Ticket`, this.ticketForm.value).subscribe(
        (res) => {
          this._commonService.showToast('Ticket Saved Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
          this.isSubmitting = false;
          this.ticketForm.reset(); 
          this.router.navigate(['ticket-new']);
        },
        (err) => {
          this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }
  trimNameOnBlur(controlName: string) {
    const control = this.ticketForm.get(controlName);
    if (control?.value) {
      // Trim leading and trailing spaces
      const trimmedValue = control.value.trim();
      // Set the trimmed value back to the form control
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
  onList() {
    this.router.navigate(['ticket-new']);
  }
}

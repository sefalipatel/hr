import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TimeAgoPipe } from '../time-ago.pipe';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { MatTooltipModule } from '@angular/material/tooltip';

export enum PriorityEnum {
  Low,
  Medium,
  High
}
export enum StatusEnum {
  Available = 0,
  Assigned = 1,
  InProgress = 2,
  InReview = 3,
  ReOpen = 4,
  Completed = 5
}
@Component({
  selector: 'app-tickets-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, TimeAgoPipe, MatTooltipModule],
  templateUrl: './tickets-detail.component.html',
  styleUrls: ['./tickets-detail.component.scss']
})
export class TicketsDetailComponent implements OnInit {
  public commentForm: FormGroup;
  public getAllDataById: any;
  public ticketDetails: any;
  public comments: any;
  public ticketId: string;
  public priority = PriorityEnum;
  public status = StatusEnum;
  public myControl = new FormControl('');
  public getComment: any;
  public getAttachment: any;
  public getAllChatData: any;
  public personId: any;
  public fileName: any;
  public file: any;
  selectedFiles: File[] = [];
  @ViewChild('fileInput') fileInput: ElementRef;
  public attachmentUrl: string = environment.apiUrl.replace('api/', '');
  dateFormat:string = localStorage.getItem('Date_Format');
  timeFormat:string = localStorage.getItem('Time_Format');
  public commentCount: number;
  public commentedFile: any[] = [];
  public timeLineData: any[] = [];
  public completedStatus: any[] = [
    {
      value: 'Re-Open',
      status: 5 
    }
  ];
  getAllTicketRecords: any;
  public isTimeLine: boolean = false;
  public isSending: boolean = false


  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder, private router: Router,
    private route: ActivatedRoute) {
    this.commentForm = this.buildForm();
    this.route?.params?.subscribe(async (params) => {
      this.ticketId = params['id'];
    })
  }

  ngOnInit(): void {
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.getAllTicketData();
    this.comment();
    this.getAllAttachment();
    this.getTimeLine();
  }

  buildForm() {
    return this.formBuilder.group({
      comment: [''],
      file: [null]
    })
  }

  // get all data of ticket details
  getAllTicketData() {
    this.commonService.get(`Ticket/Details/${this.ticketId}`).subscribe(res => {
      this.getAllDataById = res;
      if (res?.length) {
        this.ticketDetails = res[0]
      }
    })
  }

  // sent chat
  sentChat() {
    if (!this.commentForm.dirty && !this.selectedFiles.length) {
      return;
    }
  
    if (this.isSending) {
      return;
    }
  
    this.isSending = true;
  
    let formData = new FormData();
    formData.append("TicketId", this.ticketId);
    this.commentForm.value.comment ? formData.append("Comment", this.commentForm.value.comment) : '';
    this.selectedFiles.length ? formData.append("File", this.commentForm.value.file) : '';
  
    this.commonService.post('ticket/conversion', formData).subscribe(
      res => {
        this.comments = res;
        this.commentForm.reset();
        this.comment();
        this.deleteFile();
      },
      error => {
        console.error('Error sending message:', error);
      },
      () => {
        this.isSending = false;
      }
    );
  }
  

  // get all comment
  comment() {
    this.commonService.get(`Ticket/Conversion/${this.ticketId}`).subscribe(res => {
      this.getComment = res?.value;
      this.commentCount = this.getComment.length;
    })
  }

  generateInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase(); // Convert to uppercase (optional)
  }

  transformImagePath(filePath: string): string {
    return this.attachmentUrl + filePath.replace('wwwroot\\', '');
  }

  // get all attachment
  getAllAttachment() {
    this.commonService.get(`Ticket/attachment/${this.ticketId}`).subscribe(res => {
      this.getAttachment = res?.value?.map(item => {
        const docFile = item?.filePath?.split('\\')
        const fileName = docFile[docFile.length - 1];
        return { ...item, fileName };
      });
    })
  }

  isImage(filePath: string): boolean {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif']; 
    return imageExtensions.some(x=> filePath.includes(x));
  }
  // Download file
  downloadFile(text) {
    saveAs(this.attachmentUrl + text.filePath.replace('wwwroot\\', ''), text.filePath.replace('wwwroot\\', '') + '_file');
  };

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      event.target.value = '';
  
      if (this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        return;
      }
  
      this.selectedFiles = [...this.selectedFiles, file];
      this.commentForm.patchValue({ file: file });
    }
  }
  

  deleteFile(index?: number) {
    this.selectedFiles.splice(index, 1);
    this.commentForm.patchValue({ file: null });
  
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  

  stringToColor(string: any) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return string?.length ? color : '#bfbfbf';
  }

  getTimeLine() {
    this.commonService.get(`Ticket/timeline/${this.ticketId}`, {}).subscribe((res) => {
      this.timeLineData = res?.value
    })
  }
  updateStatus(data?: any) {
    if (data?.status === 1) {
      if (data?.assignedId == this.personId) {
        this.commonService.put(`Ticket/status?ticketId=${this.ticketId}&status=${2}`,{}).subscribe(res => {
          this.getAllTicketData();
        })
      }
    }
    else if (data?.status === 2) {
      if (data?.createdBy == data?.assignedId && data?.createdBy == this.personId && data.assignedId == this.personId) {
        this.commonService.put(`Ticket/status?ticketId=${this.ticketId}&status=${5}`, {}).subscribe(res => {
          this.getAllTicketData();
        })
      }
      else if (data?.assignedId == this.personId) {
        this.commonService.put(`Ticket/status?ticketId=${this.ticketId}&status=${3}`, {}).subscribe(res => {
          this.getAllTicketData();
        })
      }
    }
    else if (data?.status === 3) {
      if (data?.createdBy == this.personId) {
        this.commonService.put(`Ticket/status?ticketId=${this.ticketId}&status=${5}`,{}).subscribe(res => {
          this.getAllTicketData();
        })
      }
    }
    else if (data?.status === 5) {
      this.commonService.put(`Ticket/status?ticketId=${this.ticketId}&status=${2}&previousStatus=${5}`, {}).subscribe(res => {
        this.getAllTicketData();
      })
    }
  }
  

  changeRejectedStatus(data) {
    
    if (data?.status === 3) {
      if (data?.createdBy == this.personId) {
        this.commonService.put(`Ticket/status?ticketId=${this.ticketId}&status=${2}&previousStatus=${3}`, {}).subscribe((x) => {
          this.getAllTicketData();
        })
      }
    }
  }

  getStatus(status?: any): string {
    if (status) {
      switch (status?.status) {
        case StatusEnum.Available:
          return 'Available';
        case StatusEnum.Assigned:
          if (status.assignedId == this.personId) {
            return 'Pickup';
          } else {
            return 'Assigned';
          }
          
          case StatusEnum.InProgress:
            if (status?.createdBy == status?.assignedId  && status?.createdBy==this.personId && status.assignedId==this.personId){
              return 'Closed';
            }
           else if (status.assignedId == this.personId) {
              return 'Closed';
            }else{
              return 'In-Progress'
            }

        case StatusEnum.InReview:
          if (status.assignedId == this.personId) {
            return 'In-Review';
          } else if (status.createdBy == this.personId) {
            return 'Accept'
          }
          else {
            return 'In-Review'
          }

        // case StatusEnum.Completed:
        //   return 'Completed'

        case StatusEnum.ReOpen:
          if (status.createdBy == this.personId) {
            return 'In-Progress'
          } else if (status.assignedId == this.personId) {
            return 'Completed'
          }
          return 'Completed'
 
        default:
          return 'Available';
      }
    } else {
      return '';
    }
  }

  onTimeLineChange() {
    this.isTimeLine = !this.isTimeLine;
  }

  onTicketList(){
    this.router.navigate(['ticket']);
  }
}



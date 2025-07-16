import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { InsurancePerson, userRole } from 'src/app/assets.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import { jsPDF } from 'jspdf';
import html2pdf from 'html2pdf.js';
import { ToWords } from 'to-words';
import { AmountMaskingDirective } from '../amount-masking/amount-masking.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SafeResourceUrl } from '@angular/platform-browser';
export interface PeriodicElement {
  id: string;
  date: string;
  description: string;
  optional: boolean;
}

@Component({
  selector: 'app-pay-slip',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDatepickerModule, MatInputModule, AmountMaskingDirective],
  templateUrl: './pay-slip.component.html',
  styleUrls: ['./pay-slip.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class PaySlipComponent implements OnInit {
  public paySlipForm: FormGroup
  public getAllEmplyeeList: InsurancePerson[];
  public amount: number = 5000;
  public selectedEmployee: string;
  public selectedYear: number;
  public selectedMonth: number;
  public years: number[] = [];
  public months: { value: number, name: string }[];
  public userRole: Array<userRole> = [];
  public roleName: any;
  public userPaySlip: any;
  public combinedData: any[] = [];
  public deductionTotal: number;
  public earningTotal: number;
  public netPay: number;
  public netPayInWord: any;
  public employeeId: any;
  public paySlipMonth: number;
  public isDisable: boolean;
  loading: boolean = false;
    name: string; 

  toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    }
  });

  @ViewChild('content', { static: false }) content!: ElementRef;
  dataSource = new MatTableDataSource<PeriodicElement>();
  public orgLogo:any;
  logoUrl: string = '';
  imageUrl: string = environment.apiUrl.replace('api/', '');
  @ViewChild('payslipFrame') payslipFrame!: ElementRef<HTMLIFrameElement>;

  paySlipView: any = ''; // your HTML string goes here
sanitizedHtml: SafeResourceUrl;
  constructor(private _commonService: CommonService,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef) {
    this.paySlipForm = this.buildForm();
  }

  ngOnInit(): void {
    this._commonService.orgName$.subscribe(name => {
      this.name = name;
    });
    this.getAllEmployeePerson();
    this.months = this.generateMonthOptions();
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
   
    this._commonService.icon$.subscribe((logo) => {
      if (logo) {
        // Clean up the logo string by trimming spaces and replacing backslashes with slashes
        const cleanedLogo = logo.trim().replace(/\s+/g, '').replace(/\\/g, '/');
        // const cleanedLogo = logo?.trim()
        
        // Check if the base URL already includes the domain part
        const baseUrl = this.imageUrl.trim();
        // If base URL already contains the domain, directly use the path
        if (cleanedLogo.startsWith('http') || cleanedLogo.startsWith('https')) {
          this.logoUrl = cleanedLogo;
        } else {
          this.logoUrl = baseUrl + cleanedLogo;
        }
        
      } else {
        this.logoUrl = 'assets/default-logo.png'; // Fallback logo if no logo is provided
      }
    });

    // Set the default selected year
    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = new Date().getMonth();
    let role = localStorage.getItem('roleName');
    this.roleName = role;
    this.route.queryParams.subscribe(params => {
      this.employeeId = params['id'];
      this.paySlipMonth = +params['month']
      if (this.employeeId) {
        this.isDisable = true;
        this.selectedEmployee = this.employeeId;
      }
      if (this.paySlipMonth) {
        this.selectedMonth = this.paySlipMonth;
      } else {
        const currentDate = new Date();
        const previousMonth = currentDate.getMonth(); // 0-based index
        this.selectedMonth = previousMonth === 0 ? 12 : previousMonth; // Handle January
      }
    })
    
    // this.getPaySlip();
    this.getPaySlipView();
  }
  
  buildForm() {
    return this._formBuilder.group({
      personsId: ['', Validators.required]
    })
  }

  // year list function
  async onYearSelected(year) {
    this.selectedYear = year;
  }

  // month selection function
  async onMonthSelected(month) {
    this.selectedMonth = month;
  }

  // month option function
  generateMonthOptions(): { value: number, name: string }[] {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      const monthName = this.datePipe.transform(new Date(2000, i - 1), 'MMMM');
      options.push({ value: i, name: monthName });
    }
    return options;
  }

  // form contorl
  get paySlipFormControl() {
    return this.paySlipForm.controls;
  }

  // get all employee person
  getAllEmployeePerson() {
    this._commonService.get('Person/listemployee').subscribe(res => {
      this.getAllEmplyeeList = res;
      this.getAllEmplyeeList.sort((a, b) => a.firstName.localeCompare(b.firstName)); //Desending order
    })
  }

  getPaySlip() {
    this.earningTotal = 0;
    this.deductionTotal = 0;
    this.netPay = 0;
    this.combinedData = [];
    this.loading = true;
  
    const userId = this.selectedEmployee ?? this.employeeId ?? JSON.parse(localStorage.getItem('userInfo'))?.personID;
    const month = this.selectedMonth ?? this.paySlipMonth;
  
    this._commonService.get(`Payroll/payslip?year=${this.selectedYear}&month=${month}&employeeId=${userId}`).subscribe(res => {
      this.loading = false;
      this.userPaySlip = res;
  
      // Keep original earnings and deductions
      const fullEarnings = res.earning || [];
      const fullDeductions = res.deduction || [];
  
      this.userPaySlip.earning = fullEarnings;
      this.userPaySlip.deduction = fullDeductions;
  
      // Use filtered versions only for display
      const filteredEarnings = fullEarnings.filter(x => x.amount);
      const filteredDeductions = fullDeductions.filter(x => x.amount);
  
      // Combine arrays for table display
      for (let i = 0; i < Math.max(filteredEarnings.length, filteredDeductions.length); i++) {
        const earning = filteredEarnings[i] || null;
        const deduction = filteredDeductions[i] || null;
        this.combinedData.push({ earning, deduction });
      }
  
      // Calculate totals from full data (not filtered)
      this.earningTotal = Math.round(fullEarnings.reduce((total, item) => total + (item?.amount || 0), 0));
      this.deductionTotal = Math.round(fullDeductions.reduce((total, item) => total + (item?.amount || 0), 0));
  
      // Net Pay
      this.netPay = res?.paySlip[0]?.paidSalary ?? 0;
      this.netPayInWord = this.toWords?.convert(this.netPay);

      this.cdr.detectChanges();
    });
  }

  // Month with year
  getMonthNameWithYear(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month - 1]; // Get the month name
    const currentYear = this.selectedYear;
    return `${monthName}-${currentYear}`; // Format the month name with the current year
  }

  // Joining date : manage joining date
  formatDate(dateStr: string): string {
    const date = new Date(dateStr); // Create a Date object from the date string
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[date.getMonth()]; // Get month name abbreviation
    const year = date.getFullYear(); // Get full year
    return `${day}-${month}-${year}`; // Format the date as "DD-Mon-YYYY"
  }

  updateEmployeeSelection(value: any, isOpen: boolean) {
    if (value) {
      this.selectedEmployee = value;
      this.paySlipForm.get('personsId')?.setValue(value);
    }
  
    if (!isOpen && !this.selectedEmployee) {
      this.paySlipForm.get('personsId')?.markAsTouched();
    }
  }
  
  savebutton() {
    // this.getPaySlip();
    this.getPaySlipView();
  }

  goToProfile() {
    this.router.navigate(['user-profile'])
  }
  // public paySlipView;
  getPaySlipView() {
    const userId = this.selectedEmployee ?? this.employeeId ?? JSON.parse(localStorage.getItem('userInfo'))?.personID;
    const month = this.selectedMonth ?? this.paySlipMonth;
    this._commonService.get(`Payroll/downloadpayslip?employeeId=${userId}&year=${this.selectedYear}&month=${month}`).subscribe({
      next: (res) => {
        this.paySlipView = res.html;
        setTimeout(() => {
          const iframe = this.payslipFrame.nativeElement as HTMLIFrameElement;
          const doc = iframe.contentDocument || iframe.contentWindow?.document;

          if (doc) {
            doc.open();
            doc.write(res.html);  // this is plain HTML, not sanitized
            doc.close();
            setTimeout(() => {
              this.applyMaskingInIframe();
            }, 100);
          }
        }, 10);
       
      },
      error: (err) => {
        console.error('Error:', err);
        if (err.error instanceof ProgressEvent) {
          // This usually means a network or CORS error
          console.error('Network error or server not reachable');
        }
      }

    },)
  }

  // download the response(get from API) of HTML code
  downloadPDFFromTemplate() {
    const htmlString = this.paySlipView;

    // 1. Convert HTML string to DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // 2. Clone the DOM to avoid modifying original
    const content = doc.documentElement;
    const clone = content.cloneNode(true) as HTMLElement;

    // 3. Find the image tag
    const logoImg = clone.querySelector('img') as HTMLImageElement;

    if (logoImg && logoImg.src) {
      // 4. Convert image src to base64
      this.convertImageToBase64(logoImg.src).then(base64Image => {
        logoImg.src = base64Image;
        this.generatePDF(clone);
      }).catch(err => {
        console.error('Image base64 conversion failed:', err);
      });
    } else {
      console.warn('No logo image found. Proceeding without image.');
      this.generatePDF(clone);
    }
  }
  convertImageToBase64(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      // prevent cache
      img.src = imageUrl + '?t=' + new Date().getTime();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          reject('Canvas not supported');
        }
      };

      img.onerror = () => {
        reject('Image failed to load. Possible CORS issue.');
      };
    });
  }

  generatePDF(content: any) {
    html2pdf()
      .set({
        filename: 'payslip.pdf',
        format: 'a4',
        orientation: 'portrait',
        margin: 10,
        html2canvas: { scale: 3, useCORS: true },
        image: { type: 'jpeg', quality: 0.98 }
      })
      .from(content)
      .save();
  }
  applyMaskingInIframe() {
    const iframe = this.payslipFrame.nativeElement as HTMLIFrameElement;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
  
    if (!doc) return;
  
    const elements = doc.querySelectorAll('.masking-amount');
    elements.forEach((el: Element) => {
      const originalText = el.textContent?.trim() || '';
      el.setAttribute('data-original', originalText);
      el.textContent = '****';
      el.addEventListener('click', function () {
        const current = this.textContent?.trim();
        const original = this.getAttribute('data-original');
        this.textContent = current === '****' ? original : '****';
      });
      
      el.setAttribute('style', el.getAttribute('style') + '; cursor: pointer;');
    });
  }
    
  // download the DIRECT HTML VIEW
  downloadPDF() {
    this.convertImageToBase64(this.logoUrl).then((base64Image) => {
      if (!base64Image) {
        console.error("Failed to convert logo to base64");
        return;
      }
      const doc = new jsPDF();
      const original = this.content.nativeElement;
      const clone = original.cloneNode(true) as HTMLElement;

      // Replace **** spans with actual amount
      const spans = clone.getElementsByClassName('cursor-pointer') as any;
      for (let i = 0; i < spans.length; i++) {
        const span = spans[i];
        if (span.innerText.includes('*')) {
          span.innerText =
            span.dataset.amount ||
            span.dataset.earningtotal ||
            span.dataset.deductiontotal ||
            span.dataset.netpay ||
            span.dataset.netpayinword ||
            '0';
        }
      }
      // Replace logo with base64
      const logoImg = clone.querySelector('.logo_company img') as HTMLImageElement;
      if (logoImg) {
        logoImg.src = base64Image;
      }

      html2pdf()
        .set({
          filename: 'payslip.pdf',
          format: 'a4',
          orientation: 'landscape',
          margin: 10,
          autoPaging: 'text',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 3, useCORS: true }
        })
        .from(clone)
        .save();
    }).catch(err => {
      console.error('Error during logo conversion:', err);
    });
  }
}

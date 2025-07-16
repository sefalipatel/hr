import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ToastType } from './common.model';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  imageFileOnly: string = "image/*"
  baseAPIUrl: string;
  private _timeSheetDate = new Subject<any>();
  timeSheetDate$ = this._timeSheetDate.asObservable();

  // public defaultSetting = defaultSetting;
  // public apiRoutes = apiRoutes;
  localUrl: string = environment.apiUrl;
  pythonUrl: string = environment.pythonUrl;
  face_recognitionUrl: string = environment.pythonFaceRecogn
  loading$: Subject<boolean> = new Subject();


  constructor(private _http: HttpClient, private toastr: ToastrService,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private title: Title,) {
    this.baseAPIUrl = this.localUrl;
  }

  show() {
    this.loading$.next(true);
  }

  hide() {
    this.loading$.next(false);
  }
  sendTimeSheetDate(data: any) {
    this._timeSheetDate.next(data)
  }
  private _currency = new BehaviorSubject<string>('USD');
  public readonly currency$ = this._currency.asObservable();

  post(url: string, payload: any, header?: any): Observable<any> {
    return this._http.post(this.localUrl + url, payload, header);
  }

  put(url: string, payload: any): Observable<any> {
    return this._http.put(this.localUrl + url, payload);
  }

  get(url: string, id?: any): Observable<any> {

    return this._http.get(this.localUrl + url);
  }

  delete(url: string, id?: any): Observable<any> {
    return this._http.delete(this.localUrl + url);
  }

  postpy(url: string, payload: any, header?: any): Observable<any> {
    return this._http.post(this.pythonUrl + url, payload, header);
  }

  getpy(url: string, id?: any): Observable<any> {
    return this._http.get(this.pythonUrl + url);
  }
  postface(url: string, payload: any, header?: any): Observable<any> {
    return this._http.post(this.face_recognitionUrl + url, payload, header);
  }


  showToast(msg: string, title: string = '', type: string) {
    if (type == ToastType.SUCCESS) {
      this.toastr.success(msg, title, {
        timeOut: 1000,
        progressBar: false,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
    if (type == ToastType.ERROR) {
      this.toastr.error(msg, title, {
        timeOut: 1000,
        progressBar: false,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
    if (type == ToastType.WARNING) {
      this.toastr.warning(msg, title, {
        timeOut: 1000,
        progressBar: false,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });
    }
  }

  // public exportAsExcelFile(json: any[], excelFileName: string):void {
  //   const worksheet: XLSX.WorkSheet=XLSX.utils.json_to_sheet(json);
  //   const workbook: XLSX.WorkBook={Sheets:{'data1': worksheet }, SheetNames: ['data1']};
  //   const excelBuffer: any=XLSX.write(workbook,{bookType:'xlsx', type: 'array'});

  //   this.saveAsExcelFile(excelBuffer, excelFileName);
  // }

  // private saveAsExcelFile(buffer: any, fileName: string): void {
  //   const data: Blob=new Blob([buffer], {type: EXCEL_TYPE });
  //   FileSaver.saveAs(data,fileName + "_" + new Date().getTime() + EXCEL_EXTENSION);
  // }

  public exportAsExcelFile(data?: any[], excelFileName?: string, columns?: string[]): void {
    const filteredData = data.map(row => {
      const filteredRow = {};
      columns.forEach(column => {
        filteredRow[column] = row[column];
      });
      return filteredRow;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data1': worksheet }, SheetNames: ['data1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + "_" + new Date().getTime() + EXCEL_EXTENSION);
  }

  private emailSource = new BehaviorSubject<string>('');
  currentEmail$ = this.emailSource.asObservable();

  sendMailId(email: string) {
    this.emailSource.next(email);
  }

  private contactNumber = new BehaviorSubject<string>('');
  contactNumber$ = this.contactNumber.asObservable();

  sendContactNumber(number: string) {
    this.contactNumber.next(number);
  }

  // start : Share profile picture
  private profilePictureSubject = new BehaviorSubject<string>(null);
  profilePicture$ = this.profilePictureSubject.asObservable();

  setProfilePicture(picture: string) {
    localStorage.setItem('profilePicture', picture)
    this.profilePictureSubject.next(picture);
  }
  // End : Share profile picture

  //  private titleSource = new BehaviorSubject<string>('Default Dashboard Title');
  private titleSource = new BehaviorSubject<string>('Company Logo');
  title$ = this.titleSource.asObservable();

  updateTitle(newTitle: string): void {
    this.titleSource.next(newTitle);
  }

  private orgLogo = new BehaviorSubject<string>(
    localStorage.getItem('orgLogo') || 'Default Logo Path'
  );
  icon$ = this.orgLogo.asObservable();

  updateLogo(newLogo: string): void {
    this.orgLogo.next(newLogo); // Update the BehaviorSubject
    localStorage.setItem('orgLogo', newLogo); // Persist the logo path
  }

  private favIcon = new BehaviorSubject<string>(
    localStorage.getItem('favIcon') || 'Default Icon'
  );
  favIcon$ = this.favIcon.asObservable();

  updateFavicon(newLogo: string): void {
    this.favIcon.next(newLogo);
    localStorage.setItem('favIcon', newLogo);
  }

  private checkOutStatus = new BehaviorSubject<any>(0);
  checkOutStatus$ = this.checkOutStatus.asObservable();

  attendanceCheckOutStatus(status: any) {
    this.checkOutStatus.next(status);
  }

  private orgName = new BehaviorSubject<string>(''); // Default Name
  orgName$ = this.orgName.asObservable();

  updateOrgName(name: string) {
    this.orgName.next(name);
  }

}

export { ToastType };

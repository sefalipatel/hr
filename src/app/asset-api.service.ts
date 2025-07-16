import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Organization, ToastType } from './demo/models/models';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AssetApiService {

  private apiUrl = environment.apiUrl
  imageFileOnly: string = "image/*"

  private token$: Observable<string>; private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private tokenLoadedSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  personId: { personID: string, token }
 
  constructor(private http: HttpClient, private toastr: ToastrService) {
   
    this.loadPersonId()

  }
  private loadPersonId() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
 
    if (!this.personId || !this.personId.personID) {
    
      localStorage.setItem('userInfo', JSON.stringify(this.personId));
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  }


  get(url: string, id?: any): Observable<Organization[] | any> {
    return this.http.get(url);
  }

  post(url: string, payload: any): Observable<Organization | any> {
    return this.http.post(url, payload);
  }

  put(url: string, payload: any): Observable<Organization | any> {
    return this.http.post(url, payload);
  }
  
  delete(url: string, id?: any): Observable<Organization[] | any> {
    return this.http.delete(url);
  }

  employeeGetData(): Observable<any> {
    const url = `${this.apiUrl}/Person`;
    return this.http.get(url);
  }


  deleteEmployee(id:string):Observable<any>{
const url =`${this.apiUrl}/Person/${id}`;
return this.http.delete(url)

  }

  designationGetData():Observable<any>{
    const url = `${this.apiUrl}Designation`;
    return this.http.get(url)
  }
  DepartmentGetData():Observable<any>{
    const url = `${this.apiUrl}Department`;
    return this.http.get(url)
  }

  
  employeeAddData(formData): Observable<any> {
    const url = `${this.apiUrl}/Person`;
    
    return this.http.post(url,formData);
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
}

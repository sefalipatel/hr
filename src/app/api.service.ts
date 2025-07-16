import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, defer, from, map } from 'rxjs';
import { promises } from 'dns';
import { environment } from 'src/environments/environment';
import { userInfo } from 'os';
import { ToastType } from './service/common/common.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private token$: Observable<string>; private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private tokenLoadedSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  personId: { personID: string, token }
  private apiUrl = environment.apiUrl


  constructor(private toastr: ToastrService) { 
    this.loadPersonId()

  }
  private loadPersonId() {
    this.personId = JSON.parse(localStorage.getItem('userInfo')); 
    if (!this.personId || !this.personId.personID) {
      // Generate or retrieve the personId


      // Save the generated personId to localStorage for persistence
      localStorage.setItem('userInfo', JSON.stringify(this.personId));
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  }

  private loadToken(): Observable<string> {
    return defer(() => from(new Promise<string>((resolve) => {
      const token = this.personId.token;
      resolve(token);
    })));
  }

  private getHeaders(token: string): { [key: string]: string } {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  private createAxiosConfig(): Observable<AxiosRequestConfig> {
    return this.token$.pipe(
      map(token => {
        return { headers: this.getHeaders(token) };
      })
    );
  }


  async getSomeData(): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}Holiday`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async yearWiseHoliday(year): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}Holiday/year?year=${year}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async postData(data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}Holiday`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async putData(id: string, data: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}HolidayMaster/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteData(id: string): Promise<void> {
    try {
      const response = await axios.delete(`${this.apiUrl}Holiday/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async employeeTimesheetPostData(data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}TimesheetDetail`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async employeeTimesheetPutData(data: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}TimesheetDetail`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async employeeTimeSheetGetAll(): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}TimesheetDetail`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getTimesheetById(timesheetId: string): Promise<any> {
    const url = `${this.apiUrl}Timesheet/timesheetId?timesheetId=${timesheetId}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async alltimeCardDeatils(): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}Timesheet/WeeklyTimeCardList`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async alltimeCardDeatilslist(): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}Timesheet/WeeklyTimeCardList`);
      return response.data.map((x) => {
        return x.timesheetDetailList;
      });
    } catch (error) {
      throw error;
    }
  }

  async newTimeSheetDetails(data: any): Promise<any> { 
    const url = `${this.apiUrl}TimesheetDetail/AddTimesheetDetails/${this.personId.personID}`;
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async UpdateTimesheetStatus(data: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}Timesheet/UpdateTimesheetStatus`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async LeaveDetailsAdd(data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}EmployeeLeave`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async allLeaveDetails(): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}EmployeeLeave`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async LeaveDelete(id: string): Promise<any> {
    try {
      const response = await axios.delete(`${this.apiUrl}EmployeeLeave/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getByIdLeave(leaveID: string): Promise<any> {
    const url = `${this.apiUrl}EmployeeLeave/${leaveID}`;
    try {
      const response = await axios.get(url);
      return response.data.value;
    } catch (error) {
      throw error;
    }
  }
  async leaveUpdate(data: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}EmployeeLeave`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async approveStatusUpdate(data: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}EmployeeLeave/UpdateStatus`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async rejectStatus(data: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}EmployeeLeave/UpdateStatus`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async AttendanceAddData(data: any): Promise<any> {
    const url = `${this.apiUrl}Attendance/import/${data.personID}`;
    try {
      const response = await axios.post(url, data.formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async AttendanceAddDataGet(): Promise<any> {
    const url = `${this.apiUrl}Attendance/getAttendance`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async AttendanceGetById(attendanceId: string): Promise<any> {
    const url = `${this.apiUrl}Attendance/${attendanceId}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async attendancepersonWise(personId): Promise<any> {
    const url = `${this.apiUrl}person/${personId.personID}/attendance`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }

  }

  async missingTimeAdd(data: any): Promise<any> {
    const url = `${this.apiUrl}AttendanceRequest/AddAttendanceRequest`;
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async attendancemisstingPunchData(): Promise<any> {
    const url = `${this.apiUrl}AttendanceRequest`;
    const response = await axios.get(url);
    return response;
  } catch(error) {
    throw error;
  }

  async AttendanceAddDatastatusUpdate(data: any): Promise<any> {
    const url = `${this.apiUrl}AttendanceRequest/ApproveAttendanceRequest`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async ApproveRejectWFHCompOff(data: any): Promise<any> {
  const url = `${this.apiUrl}EmployeeWFHCompOff/ApproveRejectWFHCompOff`;
  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

  async AttendanceAddDatastatusUpdateReject(data: any): Promise<any> {
    const url = `${this.apiUrl}AttendanceRequest/RejectAttendanceRequest`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async userRequestGetData(id): Promise<any> { 
    const url = `${this.apiUrl}AttendanceRequest/GetAttendanceRequest`;
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async updateMisstingTime(data: any): Promise<any> {
    const url = `${this.apiUrl}AttendanceRequest/UpdateMarkExactTimeRequest`;
    try {
      const response = await axios.put(url, data);
      return response.data
        ;
    } catch (error) {
      throw error;
    }
  }
  async updateMisstingTimeEdit(data: any): Promise<any> {
    const url = `${this.apiUrl}AttendanceRequest/${data}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async AttendanceRequestUpdate(data: any): Promise<any> {
    const url = `${this.apiUrl}AttendanceRequest/UpdateAttendanceRequest`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async attendanceDelete(AttendanceRequestId: string): Promise<void> {
    try {
      const response = await axios.delete(`${this.apiUrl}AttendanceRequest/${AttendanceRequestId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async importDataGet(): Promise<any> {
    const url = `${this.apiUrl}Attendance/getAttendance`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async YearMonthwiseFilter(data): Promise<any> {
    let url = `${this.apiUrl}EmployeeLeave`;
    if (data?.year || data?.month) {
      url += `/search?personId=${JSON.parse(localStorage.getItem('userInfo')).personID}`
    }
    if (data?.year) {
      url += `&year=${data.year}`
    }
    if (data?.month) {
      url += `&month=${data.month}`
    }
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async loginApi(data: any): Promise<any> {
    const url = `${this.apiUrl}Auth`
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getCategory(): Promise<any> {
    const url = `${this.apiUrl}category`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getAssetCategoryById(id: string): Promise<any> {
    const url = `${this.apiUrl}category/${id}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async addCategory(data: any): Promise<any> {
    const url = `${this.apiUrl}category`;
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async updateCategory(data: any): Promise<any> {
    const url = `${this.apiUrl}category`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async deleteCategory(id: string): Promise<any> {
    const url = `${this.apiUrl}category/${id}`;
    try {
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async AddCategorySpecification(data: any): Promise<any> {
    const url = `${this.apiUrl}category/${data.categoryId}/Specification`;
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAsset(): Promise<any> {
    const url = `${this.apiUrl}asset`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAssetById(id: string): Promise<any> {
    const url = `${this.apiUrl}asset/${id}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addAsset(data: any): Promise<any> {
    const url = `${this.apiUrl}asset`;
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateAsset(data: any): Promise<any> {
    const url = `${this.apiUrl}asset`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteAsset(id: string): Promise<any> {
    const url = `${this.apiUrl}asset/${id}`;
    try {
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPerson(): Promise<any> {
    const url = `${this.apiUrl}Person`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getProjectCategory(): Promise<any> {
    const url = `${this.apiUrl}ProjectCategory`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async addProject(data: any): Promise<any> {
    const url = `${this.apiUrl}ProjectManagement`;
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getProjectDetails(): Promise<any> {
    const url = `${this.apiUrl}ProjectManagement`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(id: string): Promise<any> {
    const url = `${this.apiUrl}ProjectManagement/${id}`;
    try {
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProjectById(id: string): Promise<any> {
    const url = `${this.apiUrl}ProjectManagement/project/${id}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProject(data: any): Promise<any> {
    const url = `${this.apiUrl}ProjectManagement`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addEarning(data: any): Promise<any> {
    const url = `${this.apiUrl}Earning`;
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEarning(): Promise<any> {
    const url = `${this.apiUrl}Earning`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEarningId(id: string): Promise<any> {
    const url = `${this.apiUrl}Earning/${id}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateEarning(data: any): Promise<any> {
    const url = `${this.apiUrl}Earning`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addDeduction(data: any): Promise<any> {
    const url = `${this.apiUrl}Earning`;
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDeduction(): Promise<any> {
    const url = `${this.apiUrl}Earning`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDeductionId(id: string): Promise<any> {
    const url = `${this.apiUrl}Earning/${id}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateDeduction(data: any): Promise<any> {
    const url = `${this.apiUrl}Earning`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getcompanypolicyDetails(): Promise<any> {
    const url = `${this.apiUrl}CompanyPolicy`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getcompanypolicytype(): Promise<any> {
    const url = `${this.apiUrl}PolicyType`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getcompanypolicytypelist(): Promise<any> {
    const url = `${this.apiUrl}CompanyPolicy/CompanyPolicyGroupByPolicyType`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getcompanypolicylistbyperson(): Promise<any> {
    let id = JSON.parse(localStorage.getItem('userInfo')).personID
    const url = `${this.apiUrl}CompanyPolicy/companyPolicyByPersonId/` + id;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getInvocieDetails(): Promise<any> {
    const url = `${this.apiUrl}Invoice`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getbroadcastlist(): Promise<any> {
    const url = `${this.apiUrl}Broadcast`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getcompanyprofile(): Promise<any> {
    const url = `${this.apiUrl}OrganizationProfile/companyProfile`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getEmployeeList(): Promise<any> {
    const url = `${this.apiUrl}Person/GetEmployeeList`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
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

  async addSuggestion(data: any): Promise<any> {
    const url = `${this.apiUrl}Suggestion`;
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async getUserSuggestion(): Promise<any> {
    const url = `${this.apiUrl}Suggestion/GetMySuggetions`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async updateRemark(data: any): Promise<any> {
    const url = `${this.apiUrl}Suggestion`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addReson(data: any): Promise<any> {
    const url = `${this.apiUrl}Resignation`;
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getResignation(): Promise<any> {
    const url = `${this.apiUrl}Resignation`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getResignationById(id: string): Promise<any> {
    const url = `${this.apiUrl}Resignation/${id}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async CancellationReason(data: any): Promise<any> {
    const url = `${this.apiUrl}Resignation/cancel`;
    try {
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

}



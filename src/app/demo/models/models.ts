import { t } from "@fullcalendar/core/internal-common"

export interface Organization {
    isCaptured: boolean
    name: string,
    code: string,
    title: string,
    imageLogo: string,
    logo: string,
    imageFavicon: string,
    favicon: string,
    primaryColorCode: string,
    secondaryColorCode: string,
    description?: string,
    id?: string,
    isSelected?: boolean,
    isActive?: boolean,
    isTimer?: boolean
    is2FA?: boolean
    timer?: number,
    counter?: number,
}
export interface Loan {
    id?: string,
    name?: string,
    loanAmount?: string,
    loanStatus?: any,
    loanTenure?: string,
    monthlyAmount?: string,
    firstName?: string,
    lastName?: string,
    person?: any,
    reason?: any,
    remark?: any,
    isActive?: boolean
}
export interface Insurance {
    companyName: string,
    code: string,
    planType: string,
    coverAmount: string,
    coveragePeriod: string,
    cover: string,
    OrganizationsId: string 
    id?: string, 
}

export interface Payroll {
    employeeId: string,
    annualCTC: number,
    basic: number,
    employeeName: string,
    medical: string
    others: string
    travelAllounce: string
    bonus: number
    diwaliBonus: number
    earnigTest: null
    employeeCode: string
    hra: number
    incentive: number
    monthlyCTC: number
    payrollId: string
    salary: number
}
export enum ToastType {
    SUCCESS = "Success",
    ERROR = "Error",
    WARNING = "Warning"
}
export interface userSalaryInfo {
    employeeId: string,
    employeeCode: string,
    employeeName: string,
    annualCTC: number,
    actualSalary: number,
    paidSalary: number,
    cutLeave: number,
    carryForwardLeave: number,
    pf: number,
    pTax: number,
    tds: number
}
export interface ticketDetails {
    subject: string,
    description: string,
    priority: number,
    status: number,
    ticketCode: string,
    clientId: string,
    client: string,
    projectId: string,
    project: string,
    dueDate: string,
    createdDate: string,
    createdBy: string,
    createdEmployee: string,
    attachments: [],
    assignedId: string,
    assignedName: string,
    createdName: string,
    id: string
}

export interface userShiftSchedule {
    employeeCode: string,
    employeeName: string,
    profilePicture: string,
    shiftName: string,
    shiftStartTime: string,
    shiftEndTime: string,
    departmentName: string,
    shiftId: string,
    personId: string
}

export interface Shift {
    endTime: string
    id: string
    isActive: null
    isRotation: boolean
    lastRotationDate: null
    maxEndTime: string
    maxStartTime: string
    minEndTime: string
    minStartTime: string
    name: string
    rotationDays: number
    rotationNumber: null
    startTime: string
}
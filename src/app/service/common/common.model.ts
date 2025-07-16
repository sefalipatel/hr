
export enum ToastType {
  SUCCESS = "Success",
  ERROR = "Error",
  WARNING = "Warning"
}

export interface RolePermission {
  id: string
  canAdd: boolean
  canDelete: boolean
  canEdit: boolean
  canView: boolean
  moduleId: string
  roleId: string
  typeName?: string
  permissions?: any
  module: any
}

export interface Role {
  name: string,
  id?: string,
  isSelected?: boolean,
}

export interface Designation {
  name: string,
  id?: string,
  isActive?: boolean,
  level: number,
  description: string
}

export interface EmailSetting {
  id: string
  isDefault: boolean
  mailType: string
  organizationId: string
  sendGridAPIKey?: string
  sendGridName?: string
  sendGridSenderEmail?: string
  smtpFromEmail?: string
  smtpFromName?: string
  smtpPassword?: string
  zeptoAPIKey?: string
  zeptoBounceAddress?: string
  zeptoFromEmail?: string
  zeptoFromName?: string
  zeptoSMTPEmailAPI?: string
}

export interface DynamicKeys {
  control: string
  label: string
}

export interface Department {
  departmentName: string
  id: string
}

export interface RoleId {
  createdAt: string
  deletedAt: string
  description: string
  id: string
  name: string
  organizationId: string
  organizations: null
  updatedAt: string
}
export interface Country {
  countryName: string
  id: string
}

export interface State {
  countryId: string
  id: string
  stateName: string
}
export interface City {
  cityName: string
  id: string
  stateId: string
}
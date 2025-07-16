export interface assetsAssignment {
    name: any;
    firstName?: string;
    lastName?: string;
    id: string;
    categoryName?: string;
    assetName?: string;
}

export interface categoryName {
    id: string;
    categoryName?: string;
    categorySpecifications?: any
}

export interface userRole {
    canAdd?: boolean
    canDelete?: boolean
    canEdit?: boolean
    canView?: boolean
    module?: Module
    moduleId?: string
    roleId?: string
    permission?: any
    id?: string
}

export interface Module {
    module: string;
    description: string;
    id: string
}
export interface InsurancePerson {
    firstName?: string,
    lastName?: string,
    companyName?: string,
    planType?: string,
    id?: string
}

export interface Insurance {
    companyName: string;
    planType: string;
    organizationsId: string;
    id: string;
}

export interface employeeInsuranceList {
    amount: string,
    nextRenewalDate: string,
    insurance: Insurance,
    firstName?: string,
    lastName?: string,
    companyName?: string,
    planType?: string,
    person: InsurancePerson
}
export interface ExpenseList {
    amount: string,
    nextRenewalDate: string,
    insurance: Insurance,
    person: InsurancePerson
}
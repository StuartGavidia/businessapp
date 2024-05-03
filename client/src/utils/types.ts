export type SetBooleanState = (value: boolean) => void;

export type RegistrationFormData = {
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    hasDirectReports: boolean,
    managerCode: string,
    companyCode: string,
    positionName: string
}

export type SignInFormData = {
    username: string,
    password: string,
    rememberMe: boolean
}

export type BudgetFormData = {
    account_name: string,
    allowance: number

}

export type RegularTransactionFormData = {
    account_name: string,
    amount: number,
    descriptions: string,

}

export type IncomeTransactionFormData = {
    amount: number,
    descriptions: string
}

export type PlaidTransactionData = {
    account_name: string,
    amount: number,
    descriptions: string,
    transaction_date: Date

}
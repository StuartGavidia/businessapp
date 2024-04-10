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
    occurance: number,
    allowance: number,
    budget_date: string

}

export type StripeAccountData = {
    accountId: string,
}

export type RegularTransactionFormData = {
    account_name: string,
    amount: number,
    descriptions: string
}

export type IncomeTransactionFormData = {
    amount: number,
    description: string,
    date: string
}
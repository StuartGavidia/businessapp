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
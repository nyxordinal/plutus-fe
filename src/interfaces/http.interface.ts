export interface APIResponse<T> {
    code: number
    message: string
    data?: T
    error?: string
}

export interface AuthAPIResponse<T> {
    code: number
    message: string
    data: T
}

export interface ServiceResponse<T = any> {
    success: boolean
    message: string | string[]
    data?: T
}

export interface LoginResponse {
    id: number
    name: string
    email: string
}

export interface ExpenseResponse {
    id: number
    name: string
    type_id: number
    price: number
    date: string
}

export interface SummaryResponse {
    yearmonth: string
    amount: string
}

export interface IncomeResponse {
    id: number
    source: string
    amount: number
    date: string
}
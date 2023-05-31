import { Settings } from "./entity.interface"

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
    message: string
    data?: T
}

export interface LoginResponse {
    id: number
    name: string
    email: string
}

export interface ExpenseResponseItem {
    id: number
    name: string
    type: number
    price: number
    date: string
}

export interface ExpenseResponse {
    data: ExpenseResponseItem[]
    total: number
}

export interface SummaryResponse {
    yearmonth: string
    amount: string
}

export interface IncomeResponseItem {
    id: number
    source: string
    amount: number
    date: string
}

export interface IncomeResponse {
    id: number
    source: string
    amount: number
    date: string
}

export interface IncomeResponse {
    data: IncomeResponseItem[]
    total: number
}

export interface SettingsResponse {
    settings: Settings
}
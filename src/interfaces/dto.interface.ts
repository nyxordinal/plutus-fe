import { Expense } from "./entity.interface";

export type Order = 'asc' | 'desc';

export interface GetAllExpenseServiceResult {
    expenseData: Expense[]
    totalData: number
}

export interface CreateExpenseInterface {
    name: string
    type_id: number
    price: number
    date: string
}

export interface GetAllExpenseServiceInterface {
    page: number
    dataPerPage: number
    startDate?: Date
    endDate?: Date
    name?: string
}
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "@interface/constant";
import { Expense, Summary } from "@interface/entity.interface";
import { APIResponse, ExpenseResponse, SummaryResponse, ServiceResponse } from "@interface/http.interface";
import { formatDateSimple } from "@util";
import { API } from "api";

export const getAllExpenses = async (): Promise<Expense[]> => {
    const r: APIResponse<ExpenseResponse[]> = await API.get('/expense')
    if (r.code === HTTP_STATUS_OK) {
        const responseData = r.data as ExpenseResponse[]
        const data: Expense[] = responseData.map((expense) => {
            return {
                id: expense.id,
                name: expense.name,
                typeId: expense.type_id,
                price: expense.price,
                date: new Date(expense.date)
            }
        })
        return data
    }
    return []
}

export const getExpenseSummary = async (): Promise<Summary[]> => {
    const r: APIResponse<SummaryResponse[]> = await API.get('/expense/summary')
    if (r.code === HTTP_STATUS_OK) {
        const responseData = r.data as SummaryResponse[]
        const data: Summary[] = responseData.map((expenseSummary) => {
            return {
                yearmonth: new Date(expenseSummary.yearmonth),
                amount: parseInt(expenseSummary.amount),
            }
        })
        return data
    }
    return []
}

export const createExpense = async (
    expense: Expense,
): Promise<ServiceResponse> => {
    const data: ExpenseResponse = {
        id: expense.id,
        name: expense.name,
        type_id: expense.typeId,
        price: expense.price,
        date: formatDateSimple(expense.date)
    }

    const r: APIResponse<null> = await API.post('/expense', data)

    if (r.code === HTTP_STATUS_CREATED) return { success: true, message: r.message }
    return { success: false, message: r.error as string }
}

export const updateExpense = async (
    newData: Expense,
    oldData: Expense
): Promise<ServiceResponse> => {
    let newDate: any = newData.date
    if (typeof newDate === 'string') newDate = new Date(newDate)
    let oldDate: any = oldData.date
    if (typeof oldDate === 'string') oldDate = new Date(oldDate)
    if (
        newData.id === oldData.id
        && newData.name === oldData.name
        && newData.price === oldData.price
        && newData.typeId === oldData.typeId
        && newDate.getTime() === oldDate.getTime()
    ) {
        return { success: true, message: '' }
    }

    const data: ExpenseResponse = {
        id: newData.id,
        name: newData.name,
        type_id: newData.typeId,
        price: newData.price,
        date: newDate.toISOString().split('T')[0]
    }

    const r: APIResponse<null> = await API.put('/expense', data)

    if (r.code === HTTP_STATUS_OK) return { success: true, message: r.message }
    return { success: false, message: r.error as string }
}

export const deleteExpense = async (
    expense: Expense
): Promise<ServiceResponse> => {
    const r: APIResponse<null> = await API.delete(`/expense/${expense.id}`)

    if (r.code === HTTP_STATUS_OK) return { success: true, message: r.message }
    return { success: false, message: r.message }
}

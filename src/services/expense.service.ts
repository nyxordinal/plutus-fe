import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "@interface/constant";
import { CreateExpenseInterface, GetAllExpenseServiceInterface, GetAllExpenseServiceResult } from "@interface/dto.interface";
import { Expense, Summary } from "@interface/entity.interface";
import { APIResponse, ExpenseResponse, ExpenseResponseItem, ServiceResponse, SummaryResponse } from "@interface/http.interface";
import { API } from "api";

const getAllExpensesQuery = (params: GetAllExpenseServiceInterface): string => {
    let query = "/expense"
    params.page === 0
        ? query = query.concat("?page=1")
        : query = query.concat("?page=" + params.page.toString())
    params.dataPerPage === 0
        ? query = query.concat("&count=5")
        : query = query.concat("&count=" + params.dataPerPage.toString())
    if (params.startDate !== undefined)
        query = query.concat("&start=" + params.startDate.toISOString())
    if (params.endDate !== undefined)
        query = query.concat("&end=" + params.endDate.toISOString())
    if (params.name !== undefined && params.name !== '')
        query = query.concat("&name=" + params.name)
    return query
}

export const getAllExpenses = async (params: GetAllExpenseServiceInterface): Promise<GetAllExpenseServiceResult> => {
    const r: APIResponse<ExpenseResponse> = await API.get(getAllExpensesQuery(params))
    if (r.code === HTTP_STATUS_OK) {
        const { data, total } = r.data as ExpenseResponse
        const expenseData: Expense[] = data.map((expense) => {
            return {
                id: expense.id,
                name: expense.name,
                typeId: expense.type_id,
                price: expense.price,
                date: new Date(expense.date)
            }
        })
        return { expenseData, totalData: total, }
    }
    return { expenseData: [], totalData: 0, }
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
    expense: CreateExpenseInterface,
): Promise<ServiceResponse> => {
    const r: APIResponse<null> = await API.post('/expense', expense)

    if (r.code === HTTP_STATUS_CREATED) return { success: true, message: r.message }
    return { success: false, message: r.error as string }
}

export const updateExpense = async (
    updateData: Expense,
): Promise<ServiceResponse> => {
    const data: ExpenseResponseItem = {
        id: updateData.id,
        name: updateData.name,
        type_id: updateData.typeId,
        price: updateData.price,
        date: updateData.date.toISOString().split('T')[0]
    }

    const r: APIResponse<null> = await API.put('/expense', data)

    if (r.code === HTTP_STATUS_OK) return { success: true, message: r.message }
    return { success: false, message: r.error as string }
}

export const deleteBulkExpense = async (
    ids: number[]
): Promise<ServiceResponse> => {
    const r: APIResponse<null> = await API.post('/expense/delete/bulk', { ids })

    if (r.code === HTTP_STATUS_OK) return { success: true, message: r.message }
    return { success: false, message: r.message }
}

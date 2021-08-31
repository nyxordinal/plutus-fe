import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "@interface/constant";
import { Summary, Income } from "@interface/entity.interface";
import { APIResponse, SummaryResponse, IncomeResponse, ServiceResponse } from "@interface/http.interface";
import { formatDateSimple } from "@util";
import { API } from "api";

export const getAllIncomes = async (): Promise<Income[]> => {
    const r: APIResponse<IncomeResponse[]> = await API.get('/income')
    if (r.code === HTTP_STATUS_OK) {
        const responseData = r.data as IncomeResponse[]
        const data: Income[] = responseData.map((income) => {
            return {
                id: income.id,
                source: income.source,
                amount: income.amount,
                date: new Date(income.date)
            }
        })
        return data
    }
    return []
}

export const getIncomeSummary = async (): Promise<Summary[]> => {
    const r: APIResponse<SummaryResponse[]> = await API.get('/income/summary')
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

export const createIncome = async (
    income: Income,
): Promise<ServiceResponse> => {
    const data: IncomeResponse = {
        id: income.id,
        source: income.source,
        amount: income.amount,
        date: formatDateSimple(income.date)
    }

    const r: APIResponse<null> = await API.post('/income', data)

    if (r.code === HTTP_STATUS_CREATED) return { success: true, message: r.message }
    return { success: false, message: r.error as string }
}

export const updateIncome = async (
    newData: Income,
    oldData: Income
): Promise<ServiceResponse> => {
    let newDate: any = newData.date
    if (typeof newDate === 'string') newDate = new Date(newDate)
    let oldDate: any = oldData.date
    if (typeof oldDate === 'string') oldDate = new Date(oldDate)
    if (
        newData.id === oldData.id
        && newData.source === oldData.source
        && newData.amount === oldData.amount
        && newDate.getTime() === oldDate.getTime()
    ) {
        return { success: true, message: '' }
    }

    const data: IncomeResponse = {
        id: newData.id,
        source: newData.source,
        amount: newData.amount,
        date: newDate.toISOString().split('T')[0]
    }

    const r: APIResponse<null> = await API.put('/income', data)

    if (r.code === HTTP_STATUS_OK) return { success: true, message: r.message }
    return { success: false, message: r.error as string }
}

export const deleteIncome = async (
    income: Income
): Promise<ServiceResponse> => {
    const r: APIResponse<null> = await API.delete(`/income/${income.id}`)

    if (r.code === HTTP_STATUS_OK) return { success: true, message: r.message }
    return { success: false, message: r.message }
}

import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "@interface/constant";
import { CreateIncomeInterface, GetAllIncomeServiceResult } from "@interface/dto.interface";
import { Income, Summary } from "@interface/entity.interface";
import { APIResponse, IncomeResponse, IncomeResponseItem, ServiceResponse, SummaryResponse } from "@interface/http.interface";
import { API } from "api";

const getAllIncomesQuery = (page: number, dataPerPage: number): string => {
    let query = "/income"
    page === 0
        ? query = query.concat("?page=1")
        : query = query.concat("?page=" + page.toString())
    dataPerPage === 0
        ? query = query.concat("&count=5")
        : query = query.concat("&count=" + dataPerPage.toString())
    return query
}
export const getAllIncomes = async (page: number, dataPerPage: number): Promise<GetAllIncomeServiceResult> => {
    const r: APIResponse<IncomeResponse> = await API.get(getAllIncomesQuery(page, dataPerPage))
    if (r.code === HTTP_STATUS_OK) {
        const { data, total } = r.data as IncomeResponse
        const incomeData: Income[] = data.map((income) => {
            return {
                id: income.id,
                source: income.source,
                amount: income.amount,
                date: new Date(income.date)
            }
        })
        return { incomeData, totalData: total }
    }
    return { incomeData: [], totalData: 0 }
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
    income: CreateIncomeInterface,
): Promise<ServiceResponse> => {
    const r: APIResponse<null> = await API.post('/income', income)

    if (r.code === HTTP_STATUS_CREATED) return { success: true, message: r.message }
    return { success: false, message: r.error as string }
}

export const updateIncome = async (
    updateData: Income,
): Promise<ServiceResponse> => {
    let newDate: any = updateData.date

    const data: IncomeResponseItem = {
        id: updateData.id,
        source: updateData.source,
        amount: updateData.amount,
        date: newDate.toISOString().split('T')[0]
    }

    const r: APIResponse<null> = await API.put('/income', data)

    if (r.code === HTTP_STATUS_OK) return { success: true, message: r.message }
    return { success: false, message: r.error as string }
}

export const deleteBulkIncome = async (
    ids: number[]
): Promise<ServiceResponse> => {
    const r: APIResponse<null> = await API.post('/income/delete/bulk', { ids })

    if (r.code === HTTP_STATUS_OK) return { success: true, message: r.message }
    return { success: false, message: r.message }
}

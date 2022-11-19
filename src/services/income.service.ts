import {
  CreateIncomeInterface,
  GetAllIncomeServiceResult,
  GetExpenseSummaryResult,
} from "@interface/dto.interface";
import { Income, Summary } from "@interface/entity.interface";
import {
  APIResponse,
  IncomeResponse,
  IncomeResponseItem,
  ServiceResponse,
  SummaryResponse,
} from "@interface/http.interface";
import { formatDateSimple, logErrorResponse } from "@util";
import { API } from "api";

const getAllIncomesQuery = (page: number, dataPerPage: number): string => {
  let query = "/income";
  page === 0
    ? (query = query.concat("?page=1"))
    : (query = query.concat("?page=" + page.toString()));
  dataPerPage === 0
    ? (query = query.concat("&count=5"))
    : (query = query.concat("&count=" + dataPerPage.toString()));
  return query;
};
export const getAllIncomes = async (
  page: number,
  dataPerPage: number
): Promise<GetAllIncomeServiceResult> => {
  try {
    const r: APIResponse<IncomeResponse> = await API.get(
      getAllIncomesQuery(page, dataPerPage)
    );
    const { data, total } = r.data as IncomeResponse;
    const incomeData: Income[] = data.map((income) => {
      return {
        id: income.id,
        source: income.source,
        amount: income.amount,
        date: new Date(income.date),
      };
    });
    return { incomeData, totalData: total };
  } catch (error) {
    logErrorResponse(error);
    return { incomeData: [], totalData: 0 };
  }
};

export const getIncomeSummary = async (): Promise<GetExpenseSummaryResult> => {
  try {
    const r: APIResponse<SummaryResponse> = await API.get("/income/summary");
    const responseData = r.data as SummaryResponse;
    const data: Summary[] = responseData.data.map((expenseSummary) => {
      return {
        yearmonth: new Date(expenseSummary.yearmonth),
        amount: parseInt(expenseSummary.amount),
      };
    });
    return { total: responseData.total, average: responseData.avg, data };
  } catch (error) {
    logErrorResponse(error);
    return { total: 0, average: 0, data: [] };
  }
};

export const createIncome = async (
  income: CreateIncomeInterface
): Promise<ServiceResponse> => {
  try {
    const r: APIResponse<null> = await API.post("/income", income);
    return { success: true, message: r.message };
  } catch (error) {
    return { success: false, message: logErrorResponse(error) };
  }
};

export const updateIncome = async (
  updateData: Income
): Promise<ServiceResponse> => {
  try {
    let newDate: any = updateData.date;
    const data: IncomeResponseItem = {
      id: updateData.id,
      source: updateData.source,
      amount: updateData.amount,
      date: formatDateSimple(newDate),
    };
    const r: APIResponse<null> = await API.put("/income", data);
    return { success: true, message: r.message };
  } catch (error) {
    return { success: false, message: logErrorResponse(error) };
  }
};

export const deleteBulkIncome = async (
  ids: number[]
): Promise<ServiceResponse> => {
  try {
    const r: APIResponse<null> = await API.post("/income/delete/bulk", { ids });
    return { success: true, message: r.message };
  } catch (error) {
    return { success: false, message: logErrorResponse(error) };
  }
};

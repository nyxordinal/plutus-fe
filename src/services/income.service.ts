import {
  CreateIncomeInterface,
  GetAllIncomeServiceInterface,
  GetAllIncomeServiceResult,
  GetSummaryResult,
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


const getIncomeSummaryUrl = "/income/summary"
const getAllIncomesUrl = "/income"

const getPaginationQuery = (url: string, params: GetAllIncomeServiceInterface): string => {
  params.page === 0
    ? (url = url.concat("?page=1"))
    : (url = url.concat("?page=" + params.page.toString()));
  params.dataPerPage === 0
    ? (url = url.concat("&count=5"))
    : (url = url.concat("&count=" + params.dataPerPage.toString()));
  if (params.startDate !== undefined)
    url = url.concat("&start=" + params.startDate.toISOString());
  if (params.endDate !== undefined)
    url = url.concat("&end=" + params.endDate.toISOString());
  if (params.source !== undefined && params.source !== "")
    url = url.concat("&source=" + params.source);
  return url;
};
export const getAllIncomes = async (
  params: GetAllIncomeServiceInterface
): Promise<GetAllIncomeServiceResult> => {
  try {
    const r: APIResponse<IncomeResponse> = await API.get(
      getPaginationQuery(getAllIncomesUrl, params)
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

export const getIncomeSummary = async (page: number, dataPerPage: number): Promise<GetSummaryResult> => {
  try {
    const r: APIResponse<SummaryResponse> = await API.get(
      getPaginationQuery(getIncomeSummaryUrl, { page, dataPerPage })
    );
    const { data, total } = r.data as SummaryResponse;
    const summaryData: Summary[] = data.map((incomeSummary) => {
      return {
        yearmonth: new Date(incomeSummary.yearmonth),
        amount: parseInt(incomeSummary.amount),
      };
    });
    return { data: summaryData, totalData: total };
  } catch (error) {
    logErrorResponse(error);
    return { data: [], totalData: 0 };
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

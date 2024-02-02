import {
  CreateExpenseInterface,
  GetAllExpenseServiceInterface,
  GetAllExpenseServiceResult,
  GetSummaryResult,
} from "@interface/dto.interface";
import { Expense, Summary } from "@interface/entity.interface";
import {
  APIResponse,
  ExpenseResponse,
  ExpenseResponseItem,
  ServiceResponse,
  SummaryResponse,
} from "@interface/http.interface";
import { formatDateSimple, logErrorResponse } from "@util";
import { API } from "api";

const getExpenseSummaryUrl = "/expense/summary"
const getAllExpensesUrl = "/expense"

const getPaginationQuery = (url: string, params: GetAllExpenseServiceInterface): string => {
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
  if (params.name !== undefined && params.name !== "")
    url = url.concat("&name=" + params.name);
  return url;
};

export const getAllExpenses = async (
  params: GetAllExpenseServiceInterface
): Promise<GetAllExpenseServiceResult> => {
  try {
    const r: APIResponse<ExpenseResponse> = await API.get(
      getPaginationQuery(getAllExpensesUrl, params)
    );
    const { data, total } = r.data as ExpenseResponse;
    const expenseData: Expense[] = data.map((expense) => {
      const originType: any = expense.type;
      return {
        id: expense.id,
        name: expense.name,
        type:
          typeof originType === "string"
            ? parseInt(originType, 10)
            : originType,
        price: expense.price,
        date: new Date(expense.date),
      };
    });
    return { expenseData, totalData: total };
  } catch (error) {
    logErrorResponse(error);
    return { expenseData: [], totalData: 0 };
  }
};

export const getExpenseSummary = async (page: number, dataPerPage: number): Promise<GetSummaryResult> => {
  try {
    const r: APIResponse<SummaryResponse> = await API.get(
      getPaginationQuery(getExpenseSummaryUrl, { page, dataPerPage })
    );
    const { data, total } = r.data as SummaryResponse;
    const summaryData: Summary[] = data.map((expenseSummary) => {
      return {
        yearmonth: new Date(expenseSummary.yearmonth),
        amount: parseInt(expenseSummary.amount),
      };
    });
    return { data: summaryData, totalData: total };
  } catch (error) {
    logErrorResponse(error);
    return { data: [], totalData: 0 };
  }
};

export const createExpense = async (
  expense: CreateExpenseInterface
): Promise<ServiceResponse> => {
  try {
    const r: APIResponse<null> = await API.post("/expense", expense);
    return { success: true, message: r.message };
  } catch (error) {
    return { success: false, message: logErrorResponse(error) };
  }
};

export const updateExpense = async (
  updateData: Expense
): Promise<ServiceResponse> => {
  try {
    const data: ExpenseResponseItem = {
      id: updateData.id,
      name: updateData.name,
      type: updateData.type,
      price: updateData.price,
      date: formatDateSimple(updateData.date),
    };

    const r: APIResponse<null> = await API.put("/expense", data);
    return { success: true, message: r.message };
  } catch (error) {
    return { success: false, message: logErrorResponse(error) };
  }
};

export const deleteBulkExpense = async (
  ids: number[]
): Promise<ServiceResponse> => {
  try {
    const r: APIResponse<null> = await API.post("/expense/delete/bulk", {
      ids,
    });
    return { success: true, message: r.message };
  } catch (error) {
    return { success: false, message: logErrorResponse(error) };
  }
};

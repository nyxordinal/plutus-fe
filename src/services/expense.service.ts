import {
  CreateExpenseInterface,
  GetAllExpenseServiceInterface,
  GetAllExpenseServiceResult,
  GetExpenseSummaryResult,
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

const getAllExpensesQuery = (params: GetAllExpenseServiceInterface): string => {
  let query = "/expense";
  params.page === 0
    ? (query = query.concat("?page=1"))
    : (query = query.concat("?page=" + params.page.toString()));
  params.dataPerPage === 0
    ? (query = query.concat("&count=5"))
    : (query = query.concat("&count=" + params.dataPerPage.toString()));
  if (params.startDate !== undefined)
    query = query.concat("&start=" + params.startDate.toISOString());
  if (params.endDate !== undefined)
    query = query.concat("&end=" + params.endDate.toISOString());
  if (params.name !== undefined && params.name !== "")
    query = query.concat("&name=" + params.name);
  return query;
};

export const getAllExpenses = async (
  params: GetAllExpenseServiceInterface
): Promise<GetAllExpenseServiceResult> => {
  try {
    const r: APIResponse<ExpenseResponse> = await API.get(
      getAllExpensesQuery(params)
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

export const getExpenseSummary = async (): Promise<GetExpenseSummaryResult> => {
  try {
    const r: APIResponse<SummaryResponse> = await API.get("/expense/summary");
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

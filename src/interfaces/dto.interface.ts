import { Expense, Income, Summary } from "./entity.interface";

export type Order = "asc" | "desc";

export interface GetAllExpenseServiceResult {
  expenseData: Expense[];
  totalData: number;
}

export interface CreateExpenseInterface {
  name: string;
  type: number;
  price: number;
  date: string;
}

export interface GetAllExpenseServiceInterface {
  page: number;
  dataPerPage: number;
  startDate?: Date;
  endDate?: Date;
  name?: string;
}

export interface GetAllIncomeServiceResult {
  incomeData: Income[];
  totalData: number;
}

export interface CreateIncomeInterface {
  source: string;
  amount: number;
  date: string;
}

export interface GetExpenseSummaryResult {
  total: number;
  average: number;
  data: Summary[];
}

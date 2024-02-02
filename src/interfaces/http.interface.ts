import { Settings } from "./entity.interface";

export interface APIResponse<T> {
  code: number;
  message: string;
  data?: T;
  error?: string;
}

export interface APIError {
  message: string;
}

export interface AuthAPIResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  currency: string;
}

export interface ExpenseResponseItem {
  id: number;
  name: string;
  type: number;
  price: number;
  date: string;
}

export interface ExpenseResponse {
  data: ExpenseResponseItem[];
  total: number;
}

export interface HomeStatResponse {
  expense: {
    total: number;
    avg: number;
  },
  income: {
    total: number;
    avg: number;
  }
}

export interface SummaryResponseItem {
  yearmonth: string;
  amount: string;
}

export interface SummaryResponse {
  data: SummaryResponseItem[];
  total: number;
}

export interface IncomeResponseItem {
  id: number;
  source: string;
  amount: number;
  date: string;
}

export interface IncomeResponse {
  id: number;
  source: string;
  amount: number;
  date: string;
}

export interface IncomeResponse {
  data: IncomeResponseItem[];
  total: number;
}

export interface SettingsRequest {
  expenseLimit: number;
  isResetNotif: boolean;
  currency: string;
}

export interface SettingsResponse {
  settings: Settings;
}

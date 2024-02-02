export interface User {
  id: number;
  name: string;
  email: string;
  currency: string;
}

export interface Expense {
  id: number;
  name: string;
  type: number;
  price: number;
  date: Date;
}

export interface Income {
  id: number;
  source: string;
  amount: number;
  date: Date;
}

export interface TableItem {
  id: number;
  name: string;
  type: number;
  price: number;
  date: Date;
}

export interface Summary {
  yearmonth: Date;
  amount: number;
}

export interface Settings {
  expenseLimit: number;
  lastNotifDate: string;
  currency: string;
}

export interface HomeStat {
  expense: {
    total: number
    average: number
  }
  income: {
    total: number
    average: number
  }
}

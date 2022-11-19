import { Expense, Summary } from "@interface/entity.interface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface ExpenseState {
  summary: Summary[];
  expenses: Expense[];
}

const initialState: ExpenseState = {
  summary: [],
  expenses: [],
};

export const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpense: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload;
    },
    setExpenseSummary: (state, action: PayloadAction<Summary[]>) => {
      state.summary = action.payload;
    },
    resetExpenseReduxStore: (state, action: PayloadAction) => {
      state.summary = initialState.summary;
      state.expenses = initialState.expenses;
    },
  },
});

export const { setExpense, setExpenseSummary, resetExpenseReduxStore } =
  expenseSlice.actions;

export const getExpenseState = (state: RootState) => state.expense.expenses;
export const getExpenseSummaryState = (state: RootState) =>
  state.expense.summary;

export default expenseSlice.reducer;

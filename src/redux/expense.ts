import { Expense, Summary } from "@interface/entity.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface ExpenseState {
    summary: Summary[],
    expenses: Expense[]
}

const initialState: ExpenseState = {
    summary: [],
    expenses: []
}

export const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        setExpense: (state, action: PayloadAction<Expense[]>) => {
            state.expenses = action.payload
        },
        setExpenseSummary: (state, action: PayloadAction<Summary[]>) => {
            state.summary = action.payload
        }
    }
})

export const { setExpense, setExpenseSummary } = expenseSlice.actions

export const getExpenseState = (state: RootState) => state.expense.expenses
export const getExpenseSummaryState = (state: RootState) => state.expense.summary

export default expenseSlice.reducer
import { Income, Summary } from "@interface/entity.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface IncomeState {
    summary: Summary[]
    incomes: Income[]
}

const initialState: IncomeState = {
    summary: [],
    incomes: []
}

export const incomeSlice = createSlice({
    name: 'income',
    initialState,
    reducers: {
        setIncome: (state, action: PayloadAction<Income[]>) => {
            state.incomes = action.payload
        },
        setIncomeSummary: (state, action: PayloadAction<Summary[]>) => {
            state.summary = action.payload
        }
    }
})

export const { setIncome, setIncomeSummary } = incomeSlice.actions

export const getIncomeState = (state: RootState) => state.income.incomes
export const getIncomeSummaryState = (state: RootState) => state.income.summary

export default incomeSlice.reducer
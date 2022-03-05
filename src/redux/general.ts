import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"

export interface GeneralState {
    expenseMsg: string
    incomeMsg: string
}

const initialState: GeneralState = {
    expenseMsg: "",
    incomeMsg: ""
}

export const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        setExpenseMessage: (state, action: PayloadAction<string>) => {
            state.expenseMsg = action.payload
        },
        setIncomeMessage: (state, action: PayloadAction<string>) => {
            state.incomeMsg = action.payload
        }
    }
})

export const { setExpenseMessage, setIncomeMessage } = generalSlice.actions

export const getExpenseMsgState = (state: RootState) => state.general.expenseMsg
export const getIncomeMsgState = (state: RootState) => state.general.incomeMsg

export default generalSlice.reducer
import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from './expense';
import generalReducer from './general';
import incomeReducer from './income';

export const store = configureStore({
    reducer: {
        general: generalReducer,
        expense: expenseReducer,
        income: incomeReducer
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
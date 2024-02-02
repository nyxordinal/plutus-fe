import { HomeStat } from "@interface/entity.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface GeneralState {
  expenseMsg: string;
  incomeMsg: string;
  homeStat: {
    expense: {
      total: number
      average: number
    },
    income: {
      total: number
      average: number
    }
  }
}

const initialState: GeneralState = {
  expenseMsg: "",
  incomeMsg: "",
  homeStat: {
    expense: {
      total: 0,
      average: 0
    },
    income: {
      total: 0,
      average: 0
    }
  }
};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setExpenseMessage: (state, action: PayloadAction<string>) => {
      state.expenseMsg = action.payload;
    },
    setIncomeMessage: (state, action: PayloadAction<string>) => {
      state.incomeMsg = action.payload;
    },
    setHomeStat: (state, action: PayloadAction<HomeStat>) => {
      state.homeStat = action.payload;
    },
  },
});

export const { setExpenseMessage, setIncomeMessage, setHomeStat } = generalSlice.actions;

export const getExpenseMsgState = (state: RootState) =>
  state.general.expenseMsg;
export const getIncomeMsgState = (state: RootState) => state.general.incomeMsg;
export const getHomeStatState = (state: RootState) => state.general.homeStat;

export default generalSlice.reducer;

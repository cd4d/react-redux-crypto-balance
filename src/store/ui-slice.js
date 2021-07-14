import { createSlice } from "@reduxjs/toolkit";
import { fetchRatesAction } from "./balance-actions";

const uiSlice = createSlice({
  name: "uiSlice",
  initialState: { errors: { rates: null, news: null }, isLoading: { rates: false, news: false }, addCoinDisplayed: false },
  reducers: {
    changeIsLoading(state, action) {
      state.isLoading[action.payload.type] = action.payload.value;
    },
    changeError(state, action) {
      state.error[action.payload.type] = action.payload.value;
    },
    toggleAddCoinDisplayed(state) {
      state.addCoinDisplayed = !state.addCoinDisplayed;
    },
  },
  extraReducers: {
    [fetchRatesAction.pending]: (state) => {
      state.error.rates = null;
      state.isLoading.rates = true;
    },
    [fetchRatesAction.fulfilled]: (state) => {
      state.error.rates = null;
      state.isLoading.rates = false;
    },
    [fetchRatesAction.rejected]: (state) => {
      state.isLoading.rates = false;
      state.error.rates = "Error fetching rates.";
    },
  },
});
export const uiActions = uiSlice.actions;

export default uiSlice.reducer;

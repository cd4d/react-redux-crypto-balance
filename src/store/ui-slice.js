import { createSlice } from "@reduxjs/toolkit";
import { fetchRatesAction } from "./balance-actions";

const uiSlice = createSlice({
  name: "uiSlice",
  initialState: { error: null, isLoading: false, addCoinDisplayed: false },
  reducers: {
    changeIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    changeError(state, action) {
      state.error = action.payload;
    },
    toggleAddCoinDisplayed(state) {
      state.addCoinDisplayed = !state.addCoinDisplayed;
    },
  },
  extraReducers: {
    [fetchRatesAction.pending]: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    [fetchRatesAction.fulfilled]: (state) => {
      state.error = null;
      state.isLoading = false;
    },
    [fetchRatesAction.rejected]: (state) => {
      state.isLoading = false;
      state.error = "Error fetching rates.";
    },
  },
});
export const uiActions = uiSlice.actions;

export default uiSlice.reducer;

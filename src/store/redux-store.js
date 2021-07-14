import { configureStore } from "@reduxjs/toolkit";
import  balanceReducer  from "./balance-slice";
import  uiReducer  from "./ui-slice";
import addCoinReducer from "./addCoin-slice";

const store = configureStore({
  reducer: { balanceReducer, uiReducer,addCoinReducer },
});

export default store;

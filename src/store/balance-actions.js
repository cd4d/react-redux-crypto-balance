import { createAsyncThunk } from "@reduxjs/toolkit";
export const fetchRatesAction = createAsyncThunk(
  "balance/fetchRates",
  async (action) => {
    const formattedCoinListForAPI = action.coinsList.join("%2C");
    //console.log("fetching rates for: ", formattedCoinListForAPI);
    const formattedURL =
      "https://api.coingecko.com/api/v3/simple/price?ids=" +
      formattedCoinListForAPI +
      "&vs_currencies=" +
      action.currency.toLowerCase();
    const response = await fetch(formattedURL);
    //
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    return { rates: data, currency:action.currency };
  }
);

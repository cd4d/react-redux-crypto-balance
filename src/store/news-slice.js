import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import newsSample from "../news-sample.json";
import { fetchNews } from "../API/API-calls";

const fetchNewsAction = createAsyncThunk("news/fetchNewsActionStatus", async (action) => {
    const response = await fetchNews(action.coinsList)
    data = await response.json()
    return { newsData: data }
})
const newsSlice = createSlice({
    name: "newsSlice",
    initialState: newsSample,
    reducers: {
    },
    extraReducers: {
        [fetchNewsAction.fulfilled]: (state, action) => {
            state.newsData = action.payload.newsData
        }
    },
}
)

export const newsActions = newsSlice.actions
export default newsSlice.reducer;
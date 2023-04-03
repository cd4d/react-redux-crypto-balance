import React from "react";
import { Provider } from "react-redux";
import AddCoin from "./addCoin";
import store from "../../../../store/redux-store";
import { configureStore, createSlice } from "@reduxjs/toolkit";

// A super-simple mock of the state of the store
export const MockedState = {
  uiState: {
    addCoinDisplayed: false,
    error: { rates: null, news: null, addCoin: null },
  },
  addCoinState: {
    searchInput: "",
    resultSearch: [],
    selectedCoin: { id: "", amount: 0 },
  },
};

// A super-simple mock of a redux store
const Mockstore = ({ addCoinState, children }) => (
  <Provider
    store={configureStore({
      reducer: {
        uiReducer: createSlice({
          name: "uiSlice",
          initialState: addCoinState.uiState,
          reducers: {
            updateCoinDisplayed: (state, action) => {
              const { addCoinDisplayed } = action.payload;
              state.uiReducer.addCoinDisplayed = addCoinDisplayed;
            },
          },
        }).reducer,
        addCoinReducer: createSlice({
          name: "addCoinSlice",
          initialState: addCoinState.addCoinState,
          reducers: {},
        }).reducer,
      },
    })}
  >
    {children}
  </Provider>
);

export default {
  title: "AddCoin",
  component: AddCoin,
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = (args) => <AddCoin {...args} />;

export const Default = Template.bind({});
Default.decorators = [
  (story) => <Mockstore addCoinState={MockedState}>{story()}</Mockstore>,
];

export const InputDisplayed = Template.bind({});
InputDisplayed.decorators = [
  (story) => (
    <Mockstore
      addCoinState={{
        ...MockedState,
        uiState: {
          ...MockedState.uiState,
          addCoinDisplayed: true,
        },
      }}
    >
      {story()}
    </Mockstore>
  ),
];
export const Error = Template.bind({});
Error.decorators = [
  (story) => (
    <Mockstore
      addCoinState={{
        ...MockedState,
        uiState: {
          ...MockedState.uiState,
          addCoinDisplayed: true,
          error: { rates: null, news: null, addCoin: "Error adding coin" },
        },
      }}
    >
      {story()}
    </Mockstore>
  ),
];

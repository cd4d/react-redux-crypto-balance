import React from "react";
import { Provider, useDispatch } from "react-redux";
import AddCoin from "./addCoin";
import reduxStore from "../../../../store/redux-store";
import { uiActions } from "../../../../store/ui-slice";


export default {
  title: "AddCoin",
  component: AddCoin,
  decorators: [
    (Story) => (
      <Provider store={reduxStore}>
        <Story />
      </Provider>
    ),
  ],
};

const Template = (args) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(uiActions.resetState());
  });
  return <AddCoin {...args} />;
};

export const Default = Template.bind({});


export const InputDisplayed = Template.bind({});
InputDisplayed.decorators = [
  (Story) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
      dispatch(uiActions.setAddCoinDisplayed(true));
    });
    return <Story />;
  },
];

export const Error = Template.bind({});
Error.decorators = [
  (Story) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
      dispatch(
        uiActions.changeError({
          type: "addCoin",
          value: "Error adding coin!",
        })
      );
      dispatch(uiActions.setAddCoinDisplayed(true));
    });
    return <Story />;
  },
];

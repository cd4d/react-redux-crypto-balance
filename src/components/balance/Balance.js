import { React, useEffect, useContext } from "react";
import BalanceList from "./balance-list/BalanceList";
import BalanceChart from "./balance-chart/BalanceChart";
import { useSelector, useDispatch } from "react-redux";
import CurrencyContext from "../../store/currency-context";
import { balanceActions,fetchAndCalculate } from "../../store/balance-slice";
import { uiActions } from "../../store/ui-slice";


export default function Balance() {
  const currencyCtx = useContext(CurrencyContext);

  /**** REDUX ****/
  const balance = useSelector((state) => state.balanceReducer.balance);
  const dispatch = useDispatch();
  const coinsList = balance.map((coin) => coin.name);
  console.log(balance);
const balanceTotal = useSelector(state => state.balanceReducer.total)
  useEffect(() => {
    dispatch(balanceActions.calculateBalance());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAndCalculate({ coinsList, currency: currencyCtx,updateBalanceOnFulfilled:true }))

    // disabling coinsList check to avoir infinite lop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyCtx, dispatch]);

  const updateBalance = (newBalance) => {
    console.log(newBalance);
    dispatch(uiActions.changeIsLoading(true));
    dispatch(balanceActions.updateBalance(newBalance));

    console.log("updating balance");
    dispatch(balanceActions.calculateBalance());
    dispatch(uiActions.changeIsLoading(false));
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-7 col-sm-12">
          <h4>{balanceTotal}</h4>
          <BalanceList
            onUpdateBalance={(newBalance) => updateBalance(newBalance)}
          ></BalanceList>
        </div>
        <div className="col-md-5 col-sm-12 ">
          <BalanceChart></BalanceChart>

          {/* <BalanceNews balance={balance}></BalanceNews> */}
        </div>
      </div>
    </div>
  );
}

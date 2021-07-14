import {
  React,
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from "react";
import BalanceList from "./balance-list/BalanceList";
import BalanceNews from "./balance-news/BalanceNews";
import BalanceChart from "./balance-chart/BalanceChart";
import { fetchRates } from "../../API/API-calls";
import { useSelector, useDispatch } from "react-redux";
import CurrencyContext from "../../store/currency-context";
import { balanceActions } from "../../store/balance-slice";
import { uiActions } from "../../store/ui-slice";
import { fetchRatesAction } from "../../store/balance-actions";
export default function Balance() {
  // const [balance, setBalance] = useState(DEFAULT_BALANCE);
  const [chartUpdated, setChartUpdated] = useState(false);
  const [ratesUpdated, setRatesUpdated] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [error, setError] = useState(null);
  const currencyCtx = useContext(CurrencyContext);
  // useRef hook to avoid updating total in a loop with useState
  const total = useRef(0);
  /**** REDUX ****/
  const balance = useSelector((state) => state.balanceReducer.balance);
  const isLoading = useSelector((state) => state.uiReducer.isLoading);
  const dispatch = useDispatch();
  const coinsList = balance.map((coin) => coin.name);
  console.log(balance);

  useEffect(() => {
    dispatch(balanceActions.calculateBalance());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRatesAction({ coinsList, currency: currencyCtx }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyCtx, dispatch]);


  const triggerChartUpdate = () => {
    setChartUpdated((prevState) => !prevState);
  };

  const triggerRatesUpdate = () => {
    setRatesUpdated((prevState) => !prevState);
  };

  const updateBalance = (newBalance) => {
    console.log(newBalance);
    // setIsBalanceLoading(true);
    dispatch(uiActions.changeIsLoading(true));
    // const tempBalance = calculateBalance(newBalance);
    //setBalance(tempBalance);
    const tempBalance = dispatch(balanceActions.updateBalance(newBalance));

    if (tempBalance) {
      dispatch(balanceActions.calculateBalance());
      dispatch(uiActions.changeIsLoading(false));
    }
  };
  const balanceTotal = useSelector((state) => state.balanceReducer.total);
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-7 col-sm-12">
          <h4>{balanceTotal}</h4>
          <BalanceList
            onUpdateBalance={(newBalance) => updateBalance(newBalance)}
            triggerRatesUpdate={triggerRatesUpdate}
          ></BalanceList>
        </div>
        <div className="col-md-5 col-sm-12 ">
          <BalanceChart
            balance={balance}
            total={total.current}
            isUpdated={chartUpdated}
            isBalanceLoading={isBalanceLoading}
            error={error}
          ></BalanceChart>

          {/* <BalanceNews balance={balance}></BalanceNews> */}
        </div>
      </div>
    </div>
  );
}

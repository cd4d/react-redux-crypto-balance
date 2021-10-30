import { React, useEffect, useContext } from "react";
import { Chart } from "primereact/chart";
import { formatCurrency } from "../../../utils/utils";
import CurrencyContext from "../../../store/currency-context";
import { useSelector, useDispatch } from "react-redux";
import { balanceActions } from "../../../store/balance-slice";
export default function BalanceChart() {
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.balanceReducer.balance);
  const total = useSelector((state) => state.balanceReducer.total);
  const isBalanceLoading = useSelector(
    (state) => state.uiReducer.isLoading.rates
  );
  const formattedData = useSelector(
    (state) => state.balanceReducer.formattedData
  );
  const currencyCtx = useContext(CurrencyContext);

  useEffect(() => {
    dispatch(balanceActions.formatData());
  }, [balance, dispatch]);

  const chartOptions = {
    responsive: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#495057",
        },
      },
    },
  };
  return (
    <>
      {isBalanceLoading && (
        <div>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
        </div>
      )}
      {!isBalanceLoading && (
        <>
          <h4>Total: {formatCurrency(total, currencyCtx)}</h4>
          <Chart
            type="doughnut"
            // need to pass a copy, or gives a bug
            data={{ ...formattedData }}
            options={chartOptions}
          />
        </>
      )}
    </>
  );
}

import { React, useContext } from "react";
import { cloneDeep } from "lodash";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import AddCoin from "./add-coin/addCoin";
import { formatCurrency } from "../../../utils/utils";
import CurrencyContext from "../../../store/currency-context";
import EmptyBalance from "../EmptyBalance";

import "./balance-list.css";
import { useSelector, useDispatch } from "react-redux";

import { fetchAndCalculate } from "../../../store/balance-slice";

export default function BalanceList({ onUpdateBalance }) {
  const pageSize = 5;
  const currencyCtx = useContext(CurrencyContext);
  const isBalanceLoading = useSelector(
    (state) => state.uiReducer.isLoading.rates
  );
  const error = useSelector((state) => state.uiReducer.error.rates);
  const balance = useSelector((state) => state.balanceReducer.balance);
  const addCoinInputDisplayed = useSelector(
    (state) => state.uiReducer.addCoinDisplayed
  );
  const dispatch = useDispatch();
  // editing amount
  const onEditorAmountChange = (tableProps, event) => {
    // let updatedBalance = [...tableProps.value] does NOT work, need deep cloning
    let updatedBalance = cloneDeep(tableProps.value);
    // props is the table event
    updatedBalance[tableProps.rowIndex][tableProps.field] = event.target.value;
    onUpdateBalance(updatedBalance);
  };
  const amountEditor = (tableProps) => {
    return (
      <InputNumber
        value={tableProps.rowData["amount"]}
        onValueChange={(event) => onEditorAmountChange(tableProps, event)}
        min={0}
        className="amount-input"
        showButtons
        mode="decimal"
        minFractionDigits={1}
        maxFractionDigits={2}
      />
    );
  };
  function onRefreshRates() {
    // triggerRatesUpdate();
    const coinsList = balance.map((coin) => coin.name);
    dispatch(fetchAndCalculate({ coinsList, currency: currencyCtx }));
  }
  function onDeleteCoin(coin) {
    const updatedBalance = balance.filter((el) => el.id !== coin.id);
    onUpdateBalance(updatedBalance);
  }

  function deleteButton(coinClicked) {
    return (
      <Button onClick={() => onDeleteCoin(coinClicked)} icon="pi pi-times" />
    );
  }

  return (
    <>
      <h3>Balance List</h3>

      {isBalanceLoading && (
        <div>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
        </div>
      )}

      {!isBalanceLoading && (
        <>
          <AddCoin balance={balance} onUpdateBalance={onUpdateBalance} />
          {/* Refresh rates button  */}
          {!addCoinInputDisplayed && balance.length > 0 && (
            <button
              type="button"
              className="btn btn-secondary mt-1 me-1 btn-sm float-end"
              onClick={onRefreshRates}
            >
              <i className="pi pi-refresh" aria-hidden="true"></i>
              <span className="d-sm-none d-lg-inline"> Refresh rates</span>
            </button>
          )}
        </>
      )}
      {/* Alert message if fetching rates unsuccessful  */}
      {error && (
        <div className="alert alert-danger">
          Error fetching rates. Using default rates instead.
        </div>
      )}

      {balance.length > 0 ? (
        <div>
          <div className="card">
            <DataTable
              lazy={false}
              value={balance}
              loading={isBalanceLoading}
              autoLayout={false}
              paginator={true}
              rows={pageSize}
              sortOrder={-1}
              className="balance-list-table"
            >
              <Column field="name" header="Name" sortable></Column>
              <Column
                field="symbol"
                header="Symbol"
                sortable
                className="d-none d-sm-none d-lg-table-cell"
              ></Column>
              <Column
                field="image"
                header="Icon"
                sortable={false}
                className="d-none d-sm-none d-lg-table-cell"
                body={(coin) => (
                  <img
                    className="image-coin"
                    src={coin.image}
                    alt={coin.name}
                  ></img>
                )}
              ></Column>
              <Column
                field="rate"
                header="Rate"
                body={(coin) =>
                  formatCurrency(coin.rate, currencyCtx ? currencyCtx : "usd")
                }
                sortable
                className={error ? "table-text-error" : ""}
              ></Column>
              <Column
                field="amount"
                header="Amount"
                sortable
                editor={(props) => amountEditor(props)}
              ></Column>
              <Column
                field="value"
                header="Value"
                sortable
                body={(coin) =>
                  formatCurrency(coin.value, currencyCtx ? currencyCtx : "usd")
                }
              ></Column>
              <Column
                body={(coinClicked) => deleteButton(coinClicked)}
                header="Delete"
              ></Column>
            </DataTable>
          </div>
        </div>
      ) : (
        <EmptyBalance />
      )}
    </>
  );
}

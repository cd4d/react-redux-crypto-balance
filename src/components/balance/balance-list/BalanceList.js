import {
  React, useContext, useEffect, useState, useRef
} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import AddCoin from "./add-coin/addCoin";
import { formatCurrency } from "../../../utils/utils";
import CurrencyContext from "../../../store/currency-context";

import "./balance-list.css";
export default function BalanceList({
  balance,
  onUpdateBalance,
  isBalanceLoading,
  error,
  isUpdated
}) {
  const pageSize = 5;
  const currencyCtx = useContext(CurrencyContext)
  // const [balanceData, setBalanceData] = useState(balance)
  // useEffect(() => { setBalanceData(balance) })




  // editing amount
  const onEditorAmountChange = (tableProps, event) => {
    let updatedBalance = [...tableProps.value];
    // props is the table event
    updatedBalance[tableProps.rowIndex][tableProps.field] = event.target.value;
    onUpdateBalance(updatedBalance);
  };
  const amountEditor = (tableProps) => {
    return (
      <input
        type="number"
        value={tableProps.rowData["amount"]}
        onChange={(event) => onEditorAmountChange(tableProps, event)}
        min={0}
        className="amount-input"

      />
    );
  };
  function onDeleteCoin(coin) {
    const updatedBalance = balance.filter((el) => el.id !== coin.id);
    onUpdateBalance(updatedBalance);
  }

  function deleteButton(coinClicked) {
    return (
      <Button onClick={() => onDeleteCoin(coinClicked)} icon="pi pi-times" />
    );
  }

  function onValueChange() {
    console.log("value changed");
  }

  return (
    <>
      <h3>Balance List</h3>

      {isBalanceLoading && (
        <div>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
        </div>
      )}


      {!isBalanceLoading &&
        <>
          <AddCoin
            balance={balance}
            onUpdateBalance={onUpdateBalance}
          />
          <Button
            icon="pi pi-refresh"
            className="p-button-sm"
          //onClick={onRefreshRates}
          ></Button>
        </>
      }
      {/* Alert message if fetching rates unsuccessful  */}
      {error && <div className="alert alert-danger">Error fetching rates. Using default rates instead.</div>}

      <div>
        <div className="card">
          <DataTable
            onValueChange={onValueChange}
            lazy={false}
            loading={isBalanceLoading}
            value={balance}
            autoLayout={false}
            paginator={false}
            rows={pageSize}
            sortField="value"
            sortOrder={-1}
            className="balance-list-table"
          >
            <Column field="name" header="Name" sortable></Column>
            <Column field="symbol" header="Symbol" sortable className="d-none d-sm-none d-lg-table-cell"></Column>
            <Column
              field="rate"
              header="Rate"
              body={(coin) =>
                formatCurrency(
                  coin.rate,
                  currencyCtx ? currencyCtx : "usd"
                )
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
                formatCurrency(
                  coin.value,
                  currencyCtx ? currencyCtx : "usd"
                )
              }
            ></Column>
            <Column
              body={(coinClicked) => deleteButton(coinClicked)}
              header="Delete"
            ></Column>
          </DataTable>
        </div>
      </div>



    </>
  );
}

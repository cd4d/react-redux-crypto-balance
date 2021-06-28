import { React, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import  AddCoin  from "./add-coin/addCoin";
export default function BalanceList({ balance, onUpdateBalance }) {
  const balanceData = balance;

  useEffect(() => {
    onUpdateBalance(balanceData);
  }, [balanceData, onUpdateBalance]);

  const formatCurrency = (value, inputCurrency) => {
    console.log(value);
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: inputCurrency ? inputCurrency : "USD",
    });
  };
  const currencyBodyTemplate = (rowData) => {
    return formatCurrency(rowData.rate || rowData.value, "usd");
  };
  // editing amount
  const onEditorAmountChange = (tableProps, value) => {
    let updatedBalance = [...tableProps.value];
    // props is the table event
    updatedBalance[tableProps.rowIndex][tableProps.field] = value;
    onUpdateBalance(updatedBalance);
  };
  const amountEditor = (tableProps) => {
    return (
      <InputNumber
        value={tableProps.rowData["amount"]}
        onValueChange={(event) => onEditorAmountChange(tableProps, event.value)}
        showButtons
        min={0}
      />
    );
  };
  function onDeleteCoin(coin) {
    const updatedBalance = balanceData.filter((el) => el.id !== coin.id);
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
      <AddCoin balance={balance} onUpdateBalance={onUpdateBalance} />

      <div>
        <div className="card">
          <DataTable value={balanceData} autolayout="true">
            <Column field="name" header="Name" sortable></Column>
            <Column field="symbol" header="Symbol" sortable></Column>
            <Column
              field="rate"
              header="Rate"
              body={currencyBodyTemplate}
              sortable
            ></Column>
            <Column
              field="amount"
              header="Amount"
              sortable
              editor={(props) => amountEditor(props)}
            ></Column>
            <Column field="value" header="Value" sortable></Column>
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

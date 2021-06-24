import { React, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";

export default function BalanceList(props) {
  // console.log(props.balance);
  const [balanceData, setBalanceData] = useState(props.balance);
  const formatCurrency = (value, inputCurrency) => {
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
    props.onUpdateBalance(updatedBalance);
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
  return (
    <>
      <h3>Balance List</h3>
      <div>
        <div className="card">
          <DataTable value={balanceData}>
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
          </DataTable>
        </div>
      </div>
      {/* {props.balance.map(coin =>
                <p>{coin.name}</p>
            )} */}
    </>
  );
}

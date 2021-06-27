import { React, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from "primereact/inputnumber";
import { Button } from 'primereact/button';



export default function BalanceList({ balance, onUpdateBalance }) {
  const balanceData = balance;
  const [addCoinInputDisplayed, setAddCoinInputDisplayed] = useState(false)
  useEffect(() => {
    onUpdateBalance(balanceData);
  }, [balanceData, onUpdateBalance]);

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
    const updatedBalance = balanceData.filter(el => el.id !== coin.id)
    onUpdateBalance(updatedBalance)
  }
  function onAddCoin(coin) {
    const updatedBalance = balanceData
    updatedBalance.push(coin)
    onUpdateBalance(updatedBalance)
  }
  function deleteButton(coinClicked) {
    return (<Button onClick={() => onDeleteCoin(coinClicked)}
      icon="pi pi-times"
    />)
  }
  function toggleAddCoin() {
    setAddCoinInputDisplayed(prevState => !prevState)
  }

  return (
    <>
      <h3>Balance List</h3>
      {addCoinInputDisplayed ? <Button label="Add coin" onClick={toggleAddCoin} /> :
        <div> <InputText id="search-box" placeholder="Coin name"
        />
          <InputText id="add-coin-input-amount" placeholder="Coin name"
          />

          <div className="col pt-2">
            <span style={{ cursor: "pointer" }} onClick={() => onAddCoin()}><span
              className="pi pi-check"></span></span>
            <span style={{ cursor: "pointer" }} onClick={toggleAddCoin}><span className="pi pi-times"></span></span>
          </div>


        </div>


      }

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
            <Column body={(coinClicked) => deleteButton(coinClicked)} header="Delete" ></Column>


          </DataTable>
        </div>
      </div>

    </>
  );
}

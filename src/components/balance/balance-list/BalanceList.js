import { React, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function BalanceList(props) {
    console.log(props.balance);
    const [balanceData, setBalanceData] = useState(props.balance);
    const formatCurrency = (value, inputCurrency) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: inputCurrency ? inputCurrency : 'USD' });
    }
    const currencyBodyTemplate = (rowData) => {
        return formatCurrency(rowData.rate || rowData.value, 'usd');
    }
    return (
        <>
            <h3>Balance List</h3>
            <div>
                <div className="card">
                    <DataTable value={balanceData}>
                        <Column field="name" header="Name"></Column>
                        <Column field="symbol" header="Symbol"></Column>
                        <Column field="rate" header="Rate" body={currencyBodyTemplate}></Column>
                        <Column field="amount" header="Amount" ></Column>
                    </DataTable>
                </div>
            </div>
            {/* {props.balance.map(coin =>
                <p>{coin.name}</p>
            )} */}
        </>
    )
}
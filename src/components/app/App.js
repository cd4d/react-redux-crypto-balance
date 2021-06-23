import {React,useEffect, useState } from "react";
import Header from "../header/Header";
import Balance from "../balance/Balance";
import "./App.css";

function App() {
  const DEFAULT_BALANCE = [
    {
      name: 'Bitcoin',
      id: 'bitcoin',
      symbol: 'BTC',
      rate: 30000,
      amount: 0.5,
      subUnit: 'Satoshi',
      subUnitToUnit: 100000000,
    },
    {
      name: 'Ethereum',
      id: 'ethereum',
      symbol: 'ETH',
      rate: 2000,
      amount: 3,
      subUnit: 'GWei',
      subUnitToUnit: 1000000000,
    },
    {
      name: 'Tether',
      id: 'tether',
      symbol: 'USDT',
      rate: 1,
      amount: 3000,
    },

    {
      name: 'Dogecoin',
      id: 'dogecoin',
      symbol: 'DOGE',
      rate: 1,
      amount: 4000,
    },
    {
      name: 'Cardano',
      id: 'cardano',
      symbol: 'ADA',
      rate: 1,
      amount: 150,
    },
    {
      name: 'Ripple',
      id: 'ripple',
      symbol: 'XRP',
      rate: 1,
      amount: 200,
    },
  ]
  const [balance,setBalance] = useState(DEFAULT_BALANCE)
  const [currency,setCurrency] = useState('usd')
  return (
   <>
   <Header currency={currency}></Header>
   <Balance currency={currency} balance={balance}></Balance>
   </>
  );
}

export default App;

import {React,useState } from "react";
import Header from "../header/Header";
import Balance from "../balance/Balance";
import "./App.css";

function App() {
  const [currency,setCurrency] = useState('usd')
  
 
  return (
   <>
   <Header currency={currency}></Header>
   <Balance currency={currency} ></Balance>
   </>
  );
}

export default App;

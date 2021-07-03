import { React, useState } from "react";
import Header from "../header/Header";
import Balance from "../balance/Balance";
import "./App.css";

function App() {
  // replace this with context?
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  function changeCurrency(newCurrency) {
    setSelectedCurrency(newCurrency);
  }

  return (
    <>
      <Header selectedCurrency={selectedCurrency} changeCurrency={(newCurrency) => changeCurrency(newCurrency)}></Header>
      <Balance selectedCurrency={selectedCurrency}></Balance>
    </>
  );
}

export default App;

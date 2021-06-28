import { React, useEffect, useRef, useState, useCallback } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

// coins list for adding coin search function
import coinsList from "../../../../coins-list-sorted.json";

export default function AddCoin({ balance, onUpdateBalance }) {
  const balanceData = balance;
  const inputRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [addCoinInputDisplayed, setAddCoinInputDisplayed] = useState(false);
  // the temporary list of coins matching search
  const [resultSearch, setResultSearch] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState({ id: '', amount: 0 })


  // searching coin name from local coin list
  useEffect(() => {
    const timer = setTimeout(() => {
      // executes search function only every 500ms
      const results = searchCoin(searchInput);
      console.log("adding to results: ", results);
      setResultSearch(results);
    }, 500);
    return () => {
      // resets the timer, only last timer active (debouncing)
      console.log("cleanup");
      clearTimeout(timer);
    };
  }, [searchInput]);

  // fetching rate of new coin 
  useEffect(() => {
    // TODO get real rate from coingecko
    inputCoin(1000, "rate")

  }, [selectedCoin.name])


  function toggleAddCoin() {
    setAddCoinInputDisplayed((prevState) => !prevState);
  }
  function onAddCoin(coin) {
    if (coin && coin.id && coin.amount) {
      // console.log("sending coin: ", coin);
      const updatedBalance = balanceData;
      updatedBalance.push(coin);
      console.log("updating balance: ", updatedBalance);
      onUpdateBalance(updatedBalance);
    }

  }
  function setSearchCoin(e) {
    setSearchInput(e.target.value);
  }
  function closeInput() {
    setSearchInput("");
    toggleAddCoin();
  }
  const searchCoin = useCallback(
    (enteredInput) => {
      let result = [];
      if (!searchInput.trim()) {
        return [];
      }
      coinsList.map((coin) => {
        if (coin && enteredInput.trim().length > 1) {
          if (coin.id && coin.id.includes(enteredInput.toLowerCase())) {
            result.push(coin);
          }
          if (coin.symbol && coin.symbol.includes(enteredInput.toLowerCase())) {
            result.push(coin);
          }
        }
        return null;
      });
      console.log(result);
      return result;
    },
    [searchInput]
  );


  function inputCoin(value, property) {
    console.log("value: ", value)
    if (typeof value === "string") { value = value.toLowerCase() }
    setSelectedCoin(prevState => ({
      ...prevState, [property]: value
    }))
  }

  return (
    <>
      {addCoinInputDisplayed ? (
        <div className="row mt-2 mb-2">

          <div className="col ps-0">
            <div>
              <InputText
                ref={inputRef}
                id="search-box"
                placeholder="Coin name"
                onChange={(e) => { inputCoin(e.target.value, "id") }}
                value={selectedCoin.id}
              />
              {resultSearch && resultSearch.length > 0 && (
                <ul className="list-group">
                  {resultSearch.map((coin, idx) => (
                    <li
                      key={idx}
                      className="list-group-item list-group-item-action"
                    >
                      <span onClick={inputCoin(coin.id, "id")}>{coin.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div></div>
          <div className="col ps-0">
            <div>
              <InputText type="number" min={0} id="add-coin-input-amount" placeholder="Coin amount" value={selectedCoin.amount} onChange={(e) => inputCoin(e.target.value, "amount")} />
            </div></div>

          <div className="col pt-2">
            <span style={{ cursor: "pointer" }} onClick={() => onAddCoin(selectedCoin)}>
              <span className="pi pi-check"></span>
            </span>
            <span style={{ cursor: "pointer" }} onClick={closeInput}>
              <span className="pi pi-times"></span>
            </span>
          </div>
        </div>
      ) : (
        <Button label="Add coin" onClick={toggleAddCoin} />
      )}
    </>
  );
}

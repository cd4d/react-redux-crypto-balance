import { React, useEffect, useRef, useState, useCallback } from "react";
import { InputText } from "primereact/inputtext";
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

  function toggleAddCoin() {
    setAddCoinInputDisplayed((prevState) => !prevState);
  }
  function onAddCoin(coin) {
    const updatedBalance = balanceData;
    updatedBalance.push(coin);
    onUpdateBalance(updatedBalance);
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
  }, [searchCoin, searchInput]);

  function selectCoin() {
    console.log("selecting a coin");
  }
  return (
    <>
      {addCoinInputDisplayed ? (
        <>
          <div class="col ps-0">
            <InputText
              ref={inputRef}
              id="search-box"
              placeholder="Coin name"
              onChange={setSearchCoin}
              value={searchInput}
            />
            {resultSearch && resultSearch.length > 0 && (
              <ul className="list-group">
                {resultSearch.map((coin, idx) => (
                  <li
                    key={idx}
                    className="list-group-item list-group-item-action"
                  >
                    <span onClick={selectCoin()}>{coin.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div class="col ps-0">
            <InputText id="add-coin-input-amount" placeholder="Coin amount" />
          </div>

          <div className="col pt-2">
            <span style={{ cursor: "pointer" }} onClick={() => onAddCoin()}>
              <span className="pi pi-check"></span>
            </span>
            <span style={{ cursor: "pointer" }} onClick={closeInput}>
              <span className="pi pi-times"></span>
            </span>
          </div>
        </>
      ) : (
        <Button label="Add coin" onClick={toggleAddCoin} />
      )}
    </>
  );
}

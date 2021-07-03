import { React, useState, useRef, useCallback } from "react";
import BalanceList from "./balance-list/BalanceList";
import BalanceNews from "./balance-news/BalanceNews";
import BalanceChart from "./balance-chart/BalanceChart";
import { fetchRates } from "../../API/API-calls";
export default function Balance(props) {
  const DEFAULT_BALANCE = [
    {
      name: "Bitcoin",
      id: "bitcoin",
      symbol: "BTC",
      rate: 30000,
      amount: 0.5,
      subUnit: "Satoshi",
      subUnitToUnit: 100000000,
    },
    {
      name: "Ethereum",
      id: "ethereum",
      symbol: "ETH",
      rate: 2000,
      amount: 3,
      subUnit: "GWei",
      subUnitToUnit: 1000000000,
    },
    {
      name: "Tether",
      id: "tether",
      symbol: "USDT",
      rate: 1,
      amount: 3000,
    },

    // {
    //   name: "Dogecoin",
    //   id: "dogecoin",
    //   symbol: "DOGE",
    //   rate: 1,
    //   amount: 4000,
    // },
    // {
    //   name: "Cardano",
    //   id: "cardano",
    //   symbol: "ADA",
    //   rate: 1,
    //   amount: 150,
    // },
    // {
    //   name: "Ripple",
    //   id: "ripple",
    //   symbol: "XRP",
    //   rate: 1,
    //   amount: 200,
    // },
  ];
  const [balance, setBalance] = useState(DEFAULT_BALANCE);
  const [isUpdated, setIsUpdated] = useState(false);
  // useRef hook to avoid updating total in a loop with useState
  const total = useRef(0);
  const calculateBalance = useCallback(
    async (currentBalance) => {
      total.current = 0
      let tempBalance = currentBalance;
      // fetch rates
      let coinsList = tempBalance.map((coin) => coin.id);
      const response = await fetchRates(coinsList, props.selectedCurrency);
      // calculate value
      tempBalance.map((coin) => {
        if (response) {
          const responseKeys = Object.keys(response);
          for (let i = 0; i < responseKeys.length; i++) {
            let key = responseKeys[i];
            if (key === coin.name.toLowerCase()) {
              console.log(key);
              coin.rate =
                response[key][
                  props.selectedCurrency ? props.selectedCurrency : "usd"
                ];
              break;
            }
          }
        }
        if (coin.rate && coin.amount) {
          coin.value = +coin.rate * +coin.amount;
        }
        if (coin.value) {
          total.current += coin.value;
        }
        // get the weight of each
        if (total && total.current > 0) {
          if (coin.value) {
            coin.weight = coin.value / total.current;
          }
        }
        return coin;
      });
      return tempBalance;
    },
    [props.selectedCurrency]
  );
  const updateBalance = useCallback(
    async (newBalance) => {
      const tempBalance = await calculateBalance(newBalance);
      console.log(tempBalance);
      setBalance(tempBalance);
      setIsUpdated((prevState) => !prevState);
    },
    [calculateBalance]
  );

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-7 col-sm-12">
          <BalanceList
            selectedCurrency={props.selectedCurrency}
            balance={balance}
            total={total}
            onUpdateBalance={useCallback(
              (newBalance) => {
                updateBalance(newBalance);
              },
              [updateBalance]
            )}
          ></BalanceList>
        </div>
        <div className="col-md-5 col-sm-12 ">
          <BalanceChart
            selectedCurrency={props.selectedCurrency}
            balance={balance}
            total={total.current}
            isUpdated={isUpdated}
          ></BalanceChart>

          <BalanceNews balance={balance}></BalanceNews>
        </div>
      </div>
    </div>
  );
}

import { React, useState, useRef, useCallback, useEffect } from "react";
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
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  // useRef hook to avoid updating total in a loop with useState
  const total = useRef(0);
  let tempBalance = useRef(balance);
  useEffect(() => {
    // fetch rates
    let coinsList = balance.map((coin) => coin.id);
    const fetchData = async () => {
      console.log("fetching data");
      try {
        const response = await fetchRates(coinsList, props.selectedCurrency)
        let formattedResponse = await response.json()
        console.log(formattedResponse);
      tempBalance.current.map((coin) => {
          console.log("changing tempbalance");
          const responseKeys = Object.keys(formattedResponse);
          for (let i = 0; i < responseKeys.length; i++) {
            let key = responseKeys[i];
            if (key === coin.name.toLowerCase()) {
              //console.log(key);
              coin.rate =
              formattedResponse[key][
                  props.selectedCurrency ? props.selectedCurrency : "usd"
                ];
              break;
            }
          }
     
        return coin;
      });
      } catch (error) {
        console.log(error);
      }
      
      console.log(tempBalance.current);
      setBalance(tempBalance.current);
    };
    fetchData();
  }, [balance, props.selectedCurrency]);

  const calculateBalance = useCallback((currentBalance) => {
    total.current = 0;
    let tempBalance = currentBalance;
    // fetch rates
    // let coinsList = tempBalance.map((coin) => coin.id);
    // const response =  fetchRates(coinsList, props.selectedCurrency)
    tempBalance.map((coin) => {
      // if (response.status >= 200 && response.status <= 299) {
      //   const responseKeys = Object.keys(response);
      //   for (let i = 0; i < responseKeys.length; i++) {
      //     let key = responseKeys[i];
      //     if (key === coin.name.toLowerCase()) {
      //       console.log(key);
      //       coin.rate =
      //         response[key][
      //           props.selectedCurrency ? props.selectedCurrency : "usd"
      //         ];
      //       break;
      //     }
      //   }
      // }
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
  }, []);
  const updateBalance = useCallback(
    async (newBalance) => {
      setIsBalanceLoading(true);
      const tempBalance = calculateBalance(newBalance);
      if (tempBalance) {
        setIsBalanceLoading(false);
        console.log(tempBalance);
        setBalance(tempBalance);
        setIsUpdated((prevState) => !prevState);
      }
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
            isBalanceLoading={isBalanceLoading}
          ></BalanceList>
        </div>
        <div className="col-md-5 col-sm-12 ">
          <BalanceChart
            selectedCurrency={props.selectedCurrency}
            balance={balance}
            total={total.current}
            isUpdated={isUpdated}
            isBalanceLoading={isBalanceLoading}
          ></BalanceChart>

          <BalanceNews balance={balance}></BalanceNews>
        </div>
      </div>
    </div>
  );
}

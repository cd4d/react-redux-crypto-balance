import {
  React,
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from "react";
import BalanceList from "./balance-list/BalanceList";
import BalanceNews from "./balance-news/BalanceNews";
import BalanceChart from "./balance-chart/BalanceChart";
import { fetchRates } from "../../API/API-calls";
import CurrencyContext from "../../store/currency-context";

export default function Balance() {
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
  const [chartUpdated, setChartUpdated] = useState(false);
  const [ratesUpdated, setRatesUpdated] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [error, setError] = useState(null);
  const currencyCtx = useContext(CurrencyContext);
  // useRef hook to avoid updating total in a loop with useState
  const total = useRef(0);
  //const tempBalance = useRef(balance);

  const calculateBalance = useCallback((currentBalance) => {
    total.current = 0;
    let tempBalance = currentBalance;
    tempBalance.map((coin) => {
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
    triggerChartUpdate();
    return tempBalance;
  }, []);
  useEffect(() => {
    let useEffectBalance = balance;
    // fetch rates
    let coinsList = useEffectBalance.map((coin) => coin.id);
    setIsBalanceLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const response = await fetchRates(coinsList, currencyCtx);
        let formattedResponse;
        if (response) {
          formattedResponse = await response.json();
          useEffectBalance.map((coin) => {
            const responseKeys = Object.keys(formattedResponse);
            for (let i = 0; i < responseKeys.length; i++) {
              let key = responseKeys[i];
              if (key === coin.name.toLowerCase()) {
                //console.log(key);
                coin.rate =
                  formattedResponse[key][currencyCtx ? currencyCtx : "usd"];
                break;
              }
            }

            return coin;
          });
        }
        setIsBalanceLoading(false);
      } catch (error) {
        console.log(error.message);
        setError(error.message);
        setIsBalanceLoading(false);
      }
      calculateBalance(useEffectBalance);
      setBalance(useEffectBalance);
    };
    fetchData();
  }, [calculateBalance, currencyCtx, ratesUpdated]);

  const triggerChartUpdate = () => {
    setChartUpdated((prevState) => !prevState);
  };

  const triggerRatesUpdate = () => {
    setRatesUpdated((prevState) => !prevState);
  };

  const updateBalance = (newBalance) => {
    setIsBalanceLoading(true);
    const tempBalance = calculateBalance(newBalance);
    if (tempBalance) {
      // console.log(tempBalance);
      setBalance(tempBalance);
      setIsBalanceLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-7 col-sm-12">
          <BalanceList
            balance={balance}
            total={total}
            onUpdateBalance={(newBalance) => updateBalance(newBalance)}
            isBalanceLoading={isBalanceLoading}
            error={error}
            triggerRatesUpdate={triggerRatesUpdate}
          ></BalanceList>
        </div>
        <div className="col-md-5 col-sm-12 ">
          <BalanceChart
            balance={balance}
            total={total.current}
            isUpdated={chartUpdated}
            isBalanceLoading={isBalanceLoading}
            error={error}
          ></BalanceChart>

          <BalanceNews balance={balance}></BalanceNews>
        </div>
      </div>
    </div>
  );
}

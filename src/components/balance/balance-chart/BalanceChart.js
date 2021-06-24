import { React, useState, useEffect, useRef } from "react";
import { Chart } from "primereact/chart";
export default function BalanceChart(props) {
  const [formattedData, setFormattedData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
      },
    ],
  });
  const chartRef = useRef(null)

  console.log(props);

  useEffect(() => {
    function formatData() {
      console.log("formatting data");
      let tempData = { coinNames: [], coinValues: [] };
      props.balance.map((coin) => {
        tempData.coinNames.push(coin.name);
        tempData.coinValues.push(coin.value);
        return coin;
      });
      setFormattedData(prevState => ({ ...prevState, labels: tempData.coinNames, datasets: [{ data: tempData.coinValues }] }))
    }
    formatData()
  }, [props.isUpdated]);

  const chartData = {
    labels: [formattedData.coinNames && formattedData.coinNames],
    datasets: [
      {
        data: [formattedData.coinValues && formattedData.coinValues],
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
      },
    ],
  };
  const lightOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
  };
  return (
    <div className="card p-d-flex p-jc-center">
      <Chart
        type="pie"
        data={formattedData}
        options={lightOptions}
        style={{ position: "relative", width: "40%" }}
        ref={chartRef}
      />
    </div>
  );
}

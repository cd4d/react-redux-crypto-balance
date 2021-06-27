import { React, useState, useEffect } from "react";
import { Chart } from "primereact/chart";
export default function BalanceChart(props) {
  const initialChartData = {
    labels: ["a", "b", "c"],
    datasets: [
      {
        data: ["1000", "2000", "3000"],
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
      },
    ],
  };
  const [formattedData, setFormattedData] = useState(initialChartData);

  //console.log(props);


  useEffect(() => {
    function formatData() {
      //console.log("formatting data");
      let tempData = { coinNames: [], coinValues: [] };
      props.balance.map((coin) => {
        tempData.coinNames.push(coin.name);
        tempData.coinValues.push(coin.value);
        return coin;
      });
      // https://stackoverflow.com/questions/28121272/whats-the-best-way-to-update-an-object-in-an-array-in-reactjs
      setFormattedData((prevState) => ({
        ...prevState,
        labels: tempData.coinNames,
        datasets: prevState.datasets.map((el) =>
          el.data ? {...el, data:tempData.coinValues} : {...el}
        )
       
      }));
      //console.log("formattedData after change: ", formattedData);
    }
    formatData();
  }, [props.balance]);

  const chartOptions = {
responsive:false,
    plugins: {
      legend: {
        position:"bottom",
        labels: {
          color: "#495057",
        },
      },
    },
  };
  return (
    <div className="" >
      <Chart
        type="doughnut"
        data={formattedData}
        options={chartOptions}
        // style={{ minWidth:"20vw",maxWidth:"23vw"}}
        // style={{position: "relative", height:"45vh", width:"23vw"}}
      />
    </div>
  );
}

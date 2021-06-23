import { React } from "react";
import BalanceList from "./balance-list/BalanceList"
import BalanceNews from "./balance-news/BalanceNews"
import BalanceChart from "./balance-chart/BalanceChart"

export default function Balance(props){
    return(
<div class="container">
  <div class="row">

    <div class="col-md-6 col-sm-12">
      <BalanceList currency={props.currency} balance={props.balance}></BalanceList>
    </div>
    <div class="col-md-6 col-sm-12 ">
    <BalanceChart currency={props.currency} balance={props.balance}></BalanceChart>
 
    <BalanceNews balance={props.balance}></BalanceNews>

    </div>
  </div>
  
</div>

        
    )
}
import React, {useState} from "react";
import "./TradingSettings.css";


export default function TradingSettings(){


const [autoTrade,setAutoTrade]=useState(false);

const [lot,setLot]=useState("0.01");

const [maxTrades,setMaxTrades]=useState(5);



return(

<div className="trading-settings">


<h2>
📈 Trading Settings
</h2>




<div className="trade-row">

<span>
Auto Trading
</span>


<button

className={autoTrade ? "switch on":"switch"}

onClick={()=>setAutoTrade(!autoTrade)}

>

{autoTrade ? "ON":"OFF"}

</button>


</div>





<div className="trade-row">

<span>
Lot Size
</span>


<input

value={lot}

onChange={(e)=>setLot(e.target.value)}

/>


</div>






<div className="trade-row">

<span>
Maximum Trades
</span>


<input

type="number"

value={maxTrades}

onChange={(e)=>setMaxTrades(e.target.value)}

/>


</div>







<div className="trade-row">

<span>
Risk Mode
</span>


<select>

<option>
Safe
</option>


<option>
Medium
</option>


<option>
Aggressive
</option>


<option>
Sniper
</option>


</select>


</div>







<div className="trade-row">

<span>
Stop Loss
</span>


<input

placeholder="300 points"

/>


</div>







<div className="trade-row">

<span>
Take Profit
</span>


<input

placeholder="600 points"

/>


</div>






<div className="trade-status">

EA Configuration Ready

</div>



</div>

);


}
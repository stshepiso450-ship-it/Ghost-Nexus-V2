import React from "react";

import useSignal from "../../src/hooks/useSignal";

import "./LatestSignal.css";


const LatestSignal = () => {


const {

latestSignal

} = useSignal();





return (

<div className="latest-signal-card">


<div className="signal-header">


<div>

<h2>

📡 Latest Signal

</h2>


<p>

Ghost AI Market Analysis

</p>


</div>


<div className="signal-badge">

AI

</div>


</div>







{

latestSignal ?


<div className="signal-data">



<div className="signal-line">

<span>
Symbol
</span>

<strong>
{latestSignal.symbol}
</strong>

</div>





<div className="signal-line">

<span>
Direction
</span>

<strong

className={
latestSignal.direction === "BUY"
?
"buy"
:
latestSignal.direction === "SELL"
?
"sell"
:
"wait"
}

>

{latestSignal.direction}

</strong>


</div>








<div className="signal-line">

<span>
Entry
</span>

<strong>

{
latestSignal.entry || "--"
}

</strong>


</div>







<div className="signal-line">

<span>
Stop Loss
</span>

<strong>

{
latestSignal.stopLoss || "--"
}

</strong>


</div>







<div className="signal-line">

<span>
Take Profit
</span>

<strong>

{
latestSignal.takeProfit || "--"
}

</strong>


</div>








<div className="signal-confidence">


Confidence


<b>

{
latestSignal.confidence || 0
}%

</b>


</div>





</div>



:

<div className="empty-signal">


Waiting for AI analysis...


</div>



}





</div>

);


};


export default LatestSignal;
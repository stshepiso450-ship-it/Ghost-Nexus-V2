import React from "react";

import useDrag from "../../src/hooks/useDrag";
import useSignal from "../../src/hooks/useSignal";

import "./AISignalCard.css";


const AISignalCard = () => {


const {

latestSignal,

scanChart,

loading

} = useSignal();





const {

dragStyle,

handleMouseDown,

handleMouseMove,

handleMouseUp

} = useDrag();





return (

<div

className="ai-signal-card"

style={dragStyle}

onMouseDown={handleMouseDown}

onMouseMove={handleMouseMove}

onMouseUp={handleMouseUp}

>



<div className="card-header">


<div>

<h2>

🤖 Ghost AI Signal

</h2>


<p>

Smart Market Scanner

</p>

</div>



<span className="ai-status">

AI

</span>


</div>








<div className="signal-content">


{

latestSignal ?


<>


<div className="signal-row">

<span>
Symbol
</span>


<strong>
{latestSignal.symbol}
</strong>


</div>





<div className="signal-row">

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







<div className="signal-row">

<span>
Entry
</span>


<strong>

{

latestSignal.entry
||
"--"

}

</strong>


</div>








<div className="signal-row">

<span>
Stop Loss
</span>


<strong>

{

latestSignal.stopLoss
||
"--"

}

</strong>


</div>







<div className="signal-row">

<span>
Take Profit
</span>


<strong>

{

latestSignal.takeProfit
||
"--"

}

</strong>


</div>







<div className="confidence">


Confidence

<b>

{

latestSignal.confidence

}%

</b>


</div>



</>



:



<div className="no-signal">


No AI signal available


</div>



}



</div>







<button

className="scan-button"

onClick={scanChart}

disabled={loading}

>


{

loading

?

"Scanning..."

:

"🔍 Scan Chart"

}


</button>





</div>

);


};


export default AISignalCard;
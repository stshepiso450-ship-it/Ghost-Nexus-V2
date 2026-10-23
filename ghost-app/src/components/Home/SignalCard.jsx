import React from "react";


import {

useSignal

}

from "../../src/context/SignalContext";


import "./SignalCard.css";



function SignalCard(){


const {

signal,

loading,

analyze

}

= useSignal();





return(

<section className="signal-section">


<h2>

⚡ Ghost AI Signal

</h2>




<div className="signal-card">



<div className="signal-header">


<h3>

XAUUSD

</h3>


<span className="ai-status">

AI READY

</span>


</div>





{

signal &&

<>


<div className="signal-result">


<div

className={

signal.signal === "BUY"

?

"buy-signal"

:

signal.signal === "SELL"

?

"sell-signal"

:

"wait-signal"

}

>

{signal.signal}

</div>



<div className="confidence">

Confidence

<strong>

{signal.confidence}%

</strong>


</div>



</div>






<div className="signal-details">


<div>

Entry

<b>

{signal.entry}

</b>

</div>



<div>

TP

<b>

{signal.tp}

</b>

</div>



<div>

SL

<b>

{signal.sl}

</b>

</div>


</div>



</>

}





{

!signal &&

<div className="waiting-ai">

Press analyze to scan market

</div>


}




<button

className="analyze-btn"

onClick={()=>analyze("XAUUSD")}

disabled={loading}


>


{

loading

?

"🤖 Scanning..."

:

"🤖 Analyze Market"

}


</button>



</div>


</section>


)

}


export default SignalCard;
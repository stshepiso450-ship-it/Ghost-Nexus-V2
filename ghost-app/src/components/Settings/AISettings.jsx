import React, { useState } from "react";

import {
    analyzeChart
} from "../../services/aiService";


import {
    placeTrade
} from "../../services/tradeService";



export default function AiSettings(){


    const [image,setImage] = useState(null);


    const [symbol,setSymbol] = useState(
        "XAUUSD"
    );


    const [lot,setLot] = useState(
        0.01
    );


    const [maxTrades,setMaxTrades] = useState(
        1
    );


    const [loading,setLoading] = useState(
        false
    );


    const [signal,setSignal] = useState(
        null
    );


    const [message,setMessage] = useState(
        ""
    );





    // ==========================================
    // UPLOAD IMAGE
    // ==========================================

    function handleImage(e){

        setImage(
            e.target.files[0]
        );

    }





    // ==========================================
    // RUN AI SCANNER
    // ==========================================

    async function startScanner(){


        if(!image){

            setMessage(
                "Please upload chart screenshot"
            );

            return;

        }



        try{


            setLoading(true);


            setMessage(
                "👻 Ghost AI analyzing chart..."
            );



            const result =
            await analyzeChart(

                image,

                symbol,

                lot,

                maxTrades

            );



            console.log(
                "AI RESULT:",
                result
            );



            setSignal(

                result.signal

            );



            setMessage(
                "✅ Scan completed"
            );


        }


        catch(error){


            console.error(error);


            setMessage(
                "❌ AI Scanner error"
            );


        }


        finally{


            setLoading(false);


        }


    }





    // ==========================================
    // SEND TRADE TO EA
    // ==========================================

    async function executeTrade(){


        if(!signal){

            return;

        }



        try{


            setMessage(
                "🚀 Sending trade to Ghost EA..."
            );



            const result =
            await placeTrade(

                signal

            );



            console.log(
                result
            );



            setMessage(

                "✅ Trade sent to MT5 EA"

            );


        }


        catch(error){


            console.error(error);


            setMessage(
                "❌ Trade failed"
            );


        }


    }






return (

<div className="ghost-ai-container">



<h1>
👻 Ghost Nexus AI Scanner
</h1>


<p>
Upload your MT5 chart screenshot and let Ghost AI analyze the setup.
</p>





<div className="scanner-controls">



<label>
Trading Symbol
</label>


<select

value={symbol}

onChange={
(e)=>
setSymbol(
e.target.value
)
}

>

<option>
XAUUSD
</option>


<option>
EURUSD
</option>


<option>
GBPUSD
</option>


<option>
BTCUSD
</option>


</select>






<label>
Lot Size
</label>


<input

type="number"

step="0.01"

value={lot}

onChange={
(e)=>
setLot(
Number(
e.target.value
)
)
}

/>






<label>
Maximum Trades
</label>


<input

type="number"

value={maxTrades}

onChange={
(e)=>
setMaxTrades(
Number(
e.target.value
)
)
}

/>



</div>







<div className="upload-box">


<input

type="file"

accept="image/*"

onChange={handleImage}

/>



</div>






<button

className="scan-button"

onClick={startScanner}

disabled={loading}

>


{

loading

?

"🧠 SCANNING..."

:

"🔍 ANALYZE SCREENSHOT"

}


</button>







{
signal &&


<div className="signal-card">



<h2>
GHOST AI SIGNAL
</h2>





<div className="signal-direction">


{

signal.signal === "BUY"

?

"🟢 BUY"

:

"🔴 SELL"

}



&nbsp;


{

signal.symbol

}


</div>






<div className="trade-data">


<p>

Entry

<span>

{signal.entry}

</span>

</p>



<p>

Stop Loss

<span>

{signal.sl}

</span>

</p>



<p>

Take Profit

<span>

{signal.tp}

</span>

</p>



<p>

Confidence

<span>

{signal.confidence}%

</span>

</p>


</div>







<h3>
AI Analysis
</h3>


<ul>


{

signal.reason &&

signal.reason.map(

(reason,index)=>(

<li key={index}>

✓ {reason}

</li>

)

)

}


</ul>







<button

className="place-trade-button"

onClick={executeTrade}

>


🚀 PLACE TRADE


</button>






</div>


}







<div className="scanner-message">

{message}

</div>





</div>

);


}
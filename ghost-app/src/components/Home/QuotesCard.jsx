import React, { useState } from "react";
import "./Quotes.css";


export default function Quotes(){


const symbols = [

"EURUSD",
"GBPUSD",
"USDJPY",
"USDCHF",
"AUDUSD",
"USDCAD",
"NZDUSD",

"XAUUSD",
"XAGUSD",

"BTCUSD",
"ETHUSD",

"NAS100",
"US30",
"SPX500"

];



const [settings,setSettings] = useState({

symbol:"XAUUSD",

lot:0.01,

trades:1

});





function update(key,value){

setSettings({

...settings,

[key]:value

});

}





return (

<div className="quotes-panel">



<h2>

📈 EA Trading Symbols

</h2>





<div className="quote-grid">


{symbols.map((symbol)=>(


<button

key={symbol}

className={

settings.symbol===symbol

?

"symbol active"

:

"symbol"

}


onClick={()=>update("symbol",symbol)}

>


{symbol}


</button>



))}


</div>







<div className="trade-settings">



<div>

<label>

Selected Symbol

</label>


<strong>

{settings.symbol}

</strong>

</div>






<div>

<label>

Lot Size

</label>


<input

type="number"

step="0.01"

value={settings.lot}

onChange={(e)=>

update(

"lot",

e.target.value

)

}


/>

</div>








<div>

<label>

Max Trades

</label>


<input

type="number"

value={settings.trades}

onChange={(e)=>

update(

"trades",

e.target.value

)

}


/>

</div>





</div>




<button className="save-symbol">

Save EA Settings

</button>



</div>

);

}
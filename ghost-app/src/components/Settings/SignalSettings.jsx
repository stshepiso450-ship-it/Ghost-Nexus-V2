import React, {useState} from "react";
import "./SignalSettings.css";


export default function SignalSettings(){


const [enabled,setEnabled]=useState(true);


return(

<div className="signal-settings">


<h2>
📡 Signal Settings
</h2>





<div className="signal-row">


<span>
Live Signals
</span>


<button

className={enabled ? "signal-on":"signal-off"}

onClick={()=>setEnabled(!enabled)}

>

{

enabled ?

"ACTIVE"

:

"OFF"

}


</button>


</div>








<div className="signal-row">


<span>
Signal Mode
</span>


<select>

<option>
AI Sniper
</option>


<option>
Smart Money
</option>


<option>
Scalping
</option>


<option>
Trend Follow
</option>


</select>


</div>








<div className="signal-row">


<span>
Trend Filter
</span>


<strong className="green">

Enabled

</strong>


</div>








<div className="signal-row">


<span>
Market Structure

</span>


<strong className="green">

Detected

</strong>


</div>








<div className="signal-row">


<span>
Minimum Signal Score

</span>


<select>

<option>
3
</option>

<option>
5
</option>

<option>
7
</option>


</select>


</div>







<div className="signal-status">


Ghost AI Signal Engine Ready


</div>




</div>

);


}
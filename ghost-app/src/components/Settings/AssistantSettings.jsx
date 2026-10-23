import React, {useState} from "react";
import "./AssistantSettings.css";


export default function AssistantSettings(){


const [assistant,setAssistant]=useState(true);

const [voice,setVoice]=useState(false);



return(

<div className="assistant-settings">


<h2>
👻 Ghost Assistant
</h2>





<div className="assistant-row">

<span>
AI Assistant
</span>


<button

className={assistant ? "active":"inactive"}

onClick={()=>setAssistant(!assistant)}

>

{

assistant ?

"ON"

:

"OFF"

}

</button>


</div>







<div className="assistant-row">


<span>
Voice Assistant
</span>


<button

className={voice ? "active":"inactive"}

onClick={()=>setVoice(!voice)}

>

{

voice ?

"ON"

:

"OFF"

}

</button>


</div>








<div className="assistant-row">


<span>
Response Mode
</span>


<select>

<option>
Smart
</option>

<option>
Professional
</option>

<option>
Short
</option>


</select>


</div>







<div className="assistant-row">


<span>
Trading Advice

</span>


<strong className="green">

Enabled

</strong>


</div>






<div className="assistant-status">

Ghost AI Assistant Ready

</div>




</div>


);


}
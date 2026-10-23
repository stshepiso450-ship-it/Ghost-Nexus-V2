import React, {useState} from "react";
import "./AppearanceSettings.css";


export default function AppearanceSettings(){


const [glass,setGlass]=useState(true);

const [animation,setAnimation]=useState(true);



return(

<div className="appearance-settings">


<h2>
🎨 Appearance Settings
</h2>





<div className="appearance-row">

<span>
Glass Interface
</span>


<button

className={glass ? "active":"inactive"}

onClick={()=>setGlass(!glass)}

>

{glass ? "ON":"OFF"}

</button>


</div>







<div className="appearance-row">


<span>
Animations

</span>


<button

className={animation ? "active":"inactive"}

onClick={()=>setAnimation(!animation)}

>

{animation ? "ON":"OFF"}

</button>


</div>







<div className="appearance-row">


<span>
Layout Mode

</span>


<select>


<option>
Command Center
</option>


<option>
Compact
</option>


<option>
Professional
</option>


</select>


</div>







<div className="appearance-row">


<span>
Interface Style

</span>


<select>


<option>
Ghost Cyber
</option>


<option>
Minimal Dark
</option>


<option>
Classic Trading
</option>


</select>


</div>







<div className="appearance-status">

Ghost Nexus Interface Active

</div>



</div>


);


}
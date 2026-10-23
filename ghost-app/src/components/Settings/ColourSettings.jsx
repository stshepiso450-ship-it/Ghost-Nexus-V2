import React, {
useState,
useEffect
} from "react";

import "./settingscomponent.css";


import {
useSettings
} from "../../context/SettingsContext";




export default function ColourSettings(){



const {

settings,

updateSettings

}=useSettings();






const [colour,setColour]=useState(

settings.colour || "Neon Red"

);








useEffect(()=>{


setColour(

settings.colour || "Neon Red"

);


},[settings]);








function changeColour(e){



const value=e.target.value;



setColour(value);



updateSettings({

colour:value

});



}









return(


<div className="setting-box">


<h3>
🎨 Colour
</h3>



<p>
Choose Ghost Nexus colour system
</p>






<select

value={colour}

onChange={changeColour}

>


<option value="Neon Red">
🔴 Neon Red
</option>


<option value="Blue">
🔵 Blue
</option>


<option value="Green">
🟢 Green
</option>


<option value="Purple">
🟣 Purple
</option>


<option value="Orange">
🟠 Orange
</option>



</select>




</div>


);


}
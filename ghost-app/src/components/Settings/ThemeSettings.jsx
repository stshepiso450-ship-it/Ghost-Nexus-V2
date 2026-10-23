import React, {
useState,
useEffect
} from "react";

import "./settingscomponent.css";

import {
useSettings
} from "../../context/SettingsContext";



export default function ThemeSettings(){



const {

settings,

updateSettings

}=useSettings();





const [theme,setTheme]=useState(

settings.theme || "Default"

);







useEffect(()=>{


setTheme(

settings.theme || "Default"

);


},[settings]);









function changeTheme(e){



const value=e.target.value;



setTheme(value);



updateSettings({

theme:value

});



}







return(


<div className="setting-box">


<h3>
🌙 Theme
</h3>



<p>
Choose Ghost Nexus interface style
</p>




<select

value={theme}

onChange={changeTheme}

>


<option value="Default">
Default
</option>


<option value="Cyber">
Cyber
</option>


<option value="Glass">
Glass
</option>


<option value="Light">
Light
</option>


<option value="Dark">
Dark
</option>



</select>





</div>


);


}
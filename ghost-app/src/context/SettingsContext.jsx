import React, {
createContext,
useContext,
useState,
useEffect
} from "react";


const SettingsContext = createContext();



export function SettingsProvider({children}){


const defaultSettings={


theme:"default",

colour:"default",

background:"",

backgroundType:"image",

interfaceImage:"",

aiMode:"Normal",

risk:"Medium",

font:"Default",

notifications:true


};





const [settings,setSettings]=useState(()=>{


const saved =
localStorage.getItem("ghostSettings");


return saved

?

JSON.parse(saved)

:

defaultSettings;


});







function updateSetting(key,value){


setSettings(prev=>({


...prev,


[key]:value


}));


}








function saveSettings(){



localStorage.setItem(

"ghostSettings",

JSON.stringify(settings)

);



window.dispatchEvent(

new Event("ghost-settings-update")

);



}








useEffect(()=>{


const listener=()=>{


const saved=

localStorage.getItem(

"ghostSettings"

);



if(saved){

setSettings(

JSON.parse(saved)

);


}


};



window.addEventListener(

"ghost-settings-update",

listener

);



return()=>{


window.removeEventListener(

"ghost-settings-update",

listener

);



};



},[]);







return(

<SettingsContext.Provider

value={{

settings,

updateSetting,

saveSettings

}}

>


{children}


</SettingsContext.Provider>


);


}






export function useSettings(){

return useContext(SettingsContext);

}
import React,{useState} from "react";
import "./NotificationSettings.css";


export default function NotificationSettings({

settings,
updateSetting

}){


const [tradeAlerts,setTradeAlerts]=useState(

settings?.tradeAlerts ?? true

);


const [signalAlerts,setSignalAlerts]=useState(

settings?.signalAlerts ?? true

);


const [aiAlerts,setAiAlerts]=useState(

settings?.aiAlerts ?? true

);


const [riskAlerts,setRiskAlerts]=useState(

settings?.riskAlerts ?? true

);


const [sound,setSound]=useState(

settings?.soundNotifications ?? false

);


const [push,setPush]=useState(

settings?.pushNotifications ?? false

);







function change(name,value,setter){


setter(value);


if(updateSetting){


updateSetting(

name,

value

);


}


}






return(


<div className="notification-card">







<div className="notification-header">


<div className="notification-icon">

🔔

</div>



<div>

<h2>

Notification Settings

</h2>


<p>

Manage Ghost Nexus alerts

</p>


</div>


</div>









<div className="notification-row">


<div>

<h4>

Trade Alerts

</h4>


<span>

Entry, TP and SL notifications

</span>


</div>



<button

className={

tradeAlerts

?

"notification-toggle active"

:

"notification-toggle"

}


onClick={()=>change(

"tradeAlerts",

!tradeAlerts,

setTradeAlerts

)}

>


{tradeAlerts?"ON":"OFF"}


</button>



</div>









<div className="notification-row">


<div>

<h4>

Signal Alerts

</h4>


<span>

AI scanner signals

</span>


</div>



<button

className={

signalAlerts

?

"notification-toggle active"

:

"notification-toggle"

}


onClick={()=>change(

"signalAlerts",

!signalAlerts,

setSignalAlerts

)}

>


{signalAlerts?"ON":"OFF"}


</button>



</div>









<div className="notification-row">


<div>

<h4>

AI Assistant Alerts

</h4>


<span>

Ghost AI messages

</span>


</div>



<button

className={

aiAlerts

?

"notification-toggle active"

:

"notification-toggle"

}


onClick={()=>change(

"aiAlerts",

!aiAlerts,

setAiAlerts

)}

>


{aiAlerts?"ON":"OFF"}


</button>



</div>









<div className="notification-row">


<div>

<h4>

Risk Warnings

</h4>


<span>

Account protection alerts

</span>


</div>



<button

className={

riskAlerts

?

"notification-toggle active"

:

"notification-toggle"

}


onClick={()=>change(

"riskAlerts",

!riskAlerts,

setRiskAlerts

)}

>


{riskAlerts?"ON":"OFF"}


</button>



</div>









<div className="notification-row">


<div>

<h4>

Sound Notifications

</h4>


<span>

Alert sounds

</span>


</div>



<button

className={

sound

?

"notification-toggle active"

:

"notification-toggle"

}


onClick={()=>change(

"soundNotifications",

!sound,

setSound

)}

>


{sound?"ON":"OFF"}


</button>



</div>









<div className="notification-row">


<div>

<h4>

Push Notifications

</h4>


<span>

Mobile notifications

</span>


</div>



<button

className={

push

?

"notification-toggle active"

:

"notification-toggle"

}


onClick={()=>change(

"pushNotifications",

!push,

setPush

)}

>


{push?"ON":"OFF"}


</button>



</div>









<div className="notification-preview">


🔔 Notification System Online


<br/>


Alerts:

{

tradeAlerts && signalAlerts

?

" Active"

:

" Limited"

}


</div>








</div>


);


}
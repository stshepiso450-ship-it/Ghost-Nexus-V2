import React from "react";
import "./StatusBadge.css";


const StatusBadge = ({status}) => {


const online =
status === "online";



return (

<div

className={
online
?
"status-badge online"
:
"status-badge offline"
}

>


<span></span>


{
online
?
"Connected"
:
"Disconnected"
}


</div>


);


};


export default StatusBadge;
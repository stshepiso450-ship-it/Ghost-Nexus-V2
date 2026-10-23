import React from "react";
import "./InterfaceImage.css";

import defaultInterface from "../../assets/ghost-logo.png";


export default function InterfaceImage(){

const image =
localStorage.getItem("ghostInterface")
||
defaultInterface;


return(

<div className="interface-core">


<div className="interface-glow"></div>


<div className="interface-circle">

<img

src={image}

alt="Ghost Nexus Interface"

/>


<div className="scan-line"></div>


</div>



<div className="interface-status">

🟢 CORE INTERFACE READY

</div>



</div>

);

}
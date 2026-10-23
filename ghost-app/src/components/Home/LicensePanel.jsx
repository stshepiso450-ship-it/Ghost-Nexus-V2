import React, { useState } from "react";
import "./LicensePanel.css";

export default function LicensePanel(){

const [license,setLicense] = useState("");
const [message,setMessage] = useState("");


function activate(){

if(!license){

setMessage("Enter license key");

return;

}


setMessage("License activated successfully");


}


return(

<div className="license-card">


<div className="license-header">

🔑 ENTER LICENSE KEY

</div>


<input

type="text"

placeholder="GHOST-NEXUS-XXXX-XXXX"

value={license}

onChange={(e)=>setLicense(e.target.value)}

/>


<button onClick={activate}>

ACTIVATE LICENSE

</button>


<p>

{message}

</p>


</div>

);


}
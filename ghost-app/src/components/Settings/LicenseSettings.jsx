import React,{useState} from "react";
import "./LicenseSettings.css";


export default function LicenseSettings({

settings,
updateSetting

}){


const [license,setLicense]=useState(

settings?.licenseKey || ""

);


const [status,setStatus]=useState(

settings?.licenseStatus || "NOT ACTIVATED"

);


const [expiry,setExpiry]=useState(

settings?.licenseExpiry || "----"

);





function activateLicense(){


if(license.length > 5){


setStatus("ACTIVE");



setExpiry("180 Days");



if(updateSetting){


updateSetting(

"licenseStatus",

"ACTIVE"

);



updateSetting(

"licenseExpiry",

"180 Days"

);



}



}

else{


setStatus("INVALID");


}


}







function updateKey(e){


setLicense(e.target.value);



if(updateSetting){


updateSetting(

"licenseKey",

e.target.value

);


}


}







return(


<div className="license-card">






<div className="license-header">


<div className="license-icon">

🔑

</div>



<div>

<h2>

License Settings

</h2>


<p>

Manage Ghost Nexus activation

</p>


</div>


</div>









<div className="license-box">


<label>

License Key

</label>


<input

type="text"

placeholder="GNX-XXXX-XXXX"

value={license}

onChange={updateKey}

/>


</div>









<button

className="activate-btn"

onClick={activateLicense}

>

Activate License

</button>









<div className="license-status">


<div>


<h4>

Status

</h4>


<span className={

status==="ACTIVE"

?

"active"

:

""

}>


{status}


</span>


</div>







<div>


<h4>

Expiry

</h4>


<span>

{expiry}

</span>


</div>



</div>









<div className="ea-license">


🤖 EA License:

<strong>

{

status==="ACTIVE"

?

" ENABLED"

:

" LOCKED"

}

</strong>


</div>








</div>


);


}
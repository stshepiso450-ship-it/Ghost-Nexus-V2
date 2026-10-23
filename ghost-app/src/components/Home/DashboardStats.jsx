import React from "react";
import "./DashboardStats.css";
import {
FaMicrochip,
FaMemory,
FaWifi,
FaRobot,
FaServer,
FaKey
} from "react-icons/fa";

import { useDashboard } from "../../context/DashboardContext";

export default function DashboardStats(){

const { dashboard } = useDashboard();

return(

<div className="dashboard-stats">

<div className="stat-card">

<FaServer/>

<h3>Backend</h3>

<p>

{

dashboard.backend

?

"🟢 Online"

:

"🔴 Offline"

}

</p>

</div>

<div className="stat-card">

<FaRobot/>

<h3>MetaAPI</h3>

<p>

{

dashboard.metaapi

?

"🟢 Connected"

:

"🔴 Offline"

}

</p>

</div>

<div className="stat-card">

<FaKey/>

<h3>License</h3>

<p>

{

dashboard.license

?

"🟢 Active"

:

"🔴 Inactive"

}

</p>

</div>

<div className="stat-card">

<FaWifi/>

<h3>Ping</h3>

<h2>

{dashboard.ping}

ms

</h2>

</div>

<div className="stat-card">

<FaMicrochip/>

<h3>CPU</h3>

<h2>

14%

</h2>

</div>

<div className="stat-card">

<FaMemory/>

<h3>RAM</h3>

<h2>

31%

</h2>

</div>

</div>

);

}
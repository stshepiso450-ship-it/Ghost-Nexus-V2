import React from "react";
import "./AIScannerCard.css";
import { FaRobot } from "react-icons/fa";
import { useDashboard } from "../../context/DashboardContext";

export default function AIScannerCard() {

const { dashboard } = useDashboard();

return(

<div className="scanner-card">

<div className="scanner-top">

<FaRobot/>

<div>

<h3>Ghost AI Scanner</h3>

<span>

{dashboard.scanner

?

"🟢 AI Online"

:

"🔴 Offline"

}

</span>

</div>

</div>

<div className="scanner-content">

<div>

<small>Strategy</small>

<h2>{dashboard.strategy}</h2>

</div>

<div>

<small>Signal</small>

<h2>

{dashboard.buy>

dashboard.sell

?

"BUY"

:

dashboard.sell>

dashboard.buy

?

"SELL"

:

"WAIT"

}

</h2>

</div>

<div>

<small>Symbol</small>

<h2>{dashboard.symbol}</h2>

</div>

<div>

<small>Confidence</small>

<h2>98%</h2>

</div>

</div>

<button className="scanner-button">

Open AI Scanner

</button>

</div>

);

}
import React from "react";
import "./CustomInterface.css";
import { useApp } from "../../context/AppContext";

const interfaceItems = [

{ key:"showGhostCore", label:"👻 Ghost Core" },
{ key:"showServerOrb", label:"🌐 Server Orb" },
{ key:"showScanner", label:"🤖 AI Scanner" },
{ key:"showRobots", label:"🤖 Robot List" },
{ key:"showTradingView", label:"📈 TradingView Chart" },
{ key:"showMarketWatch", label:"📊 Market Watch" },
{ key:"showSignals", label:"📡 Live Signals" },
{ key:"showNews", label:"📰 Forex News" },
{ key:"showCalendar", label:"📅 Economic Calendar" },
{ key:"showProfitPanel", label:"💰 Profit Panel" },

{ key:"showBalance", label:"💳 Balance Card" },
{ key:"showEquity", label:"📈 Equity Card" },
{ key:"showSpread", label:"📉 Spread Monitor" },
{ key:"showPing", label:"📶 Server Ping" },
{ key:"showTrades", label:"📂 Open Trades" },
{ key:"showHistory", label:"📜 Trade History" },
{ key:"showNotifications", label:"🔔 Notifications" },
{ key:"showAssistant", label:"🤖 Ghost AI Assistant" },
{ key:"showVoice", label:"🎤 Voice Assistant" },
{ key:"showFloatingButtons", label:"🎮 Floating Buttons" },

{ key:"showParticles", label:"✨ Particles" },
{ key:"showGlass", label:"🪟 Glass Effect" },
{ key:"showAnimations", label:"⚡ UI Animations" },
{ key:"showGlow", label:"💡 Neon Glow" },
{ key:"showBackgroundVideo", label:"🎥 Background Video" },
{ key:"showBackgroundMusic", label:"🎵 Background Music" },
{ key:"showClock", label:"🕒 Live Clock" },
{ key:"showWeather", label:"🌦 Weather Widget" },
{ key:"showCPU", label:"🖥 CPU Usage" },
{ key:"showRAM", label:"💾 RAM Usage" },

{ key:"showGPU", label:"🎮 GPU Status" },
{ key:"showNetwork", label:"🌍 Network Status" },
{ key:"showLicenses", label:"🔑 License Status" },
{ key:"showUpdates", label:"⬆ Update Notifications" },
{ key:"showLogs", label:"📄 System Logs" },
{ key:"showTerminal", label:"⌨ Terminal Panel" },
{ key:"showCharts", label:"📉 Analytics Charts" },
{ key:"showHeatMap", label:"🔥 Market Heatmap" },
{ key:"showPortfolio", label:"💼 Portfolio" },
{ key:"showDashboard", label:"🏠 Dashboard Widgets" }

];

export default function CustomInterface(){

const { settings, updateSettings } = useApp();

function toggleSetting(key){

updateSettings({

[key]:!settings[key]

});

}

return(

<div className="interface-settings">

<h2>

🖥 Custom Interface

</h2>

<p>

Enable or disable Ghost Nexus dashboard components.

</p>

<div className="interface-grid">

{

interfaceItems.map((item,index)=>(

<div

key={index}

className="interface-card"

>

<div className="interface-name">

{item.label}

</div>

<label className="switch">

<input

type="checkbox"

checked={settings[item.key] || false}

onChange={()=>toggleSetting(item.key)}

/>

<span className="slider"/>

</label>

</div>

))

}

</div>

<div className="summary">

<h3>

Enabled Features

</h3>

<p>

{

interfaceItems.filter(

item=>settings[item.key]

).length

}

 /

{

interfaceItems.length

}

 Enabled

</p>

</div>

</div>

);

}
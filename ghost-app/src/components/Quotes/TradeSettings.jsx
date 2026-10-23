import React, { useState } from "react";
import "./TradeSettings.css";
import SaveQuotes from "./SaveQuotes";

export default function TradeSettings({ selectedSymbols }) {

    const [lotSize, setLotSize] = useState(0.01);

    const [maxTrades, setMaxTrades] = useState(2);

    const [risk, setRisk] = useState("Medium");

    const [confidence, setConfidence] = useState(85);

    const [scanInterval, setScanInterval] = useState(5);

    const [autoExecute, setAutoExecute] = useState(true);

    const [scannerEnabled, setScannerEnabled] = useState(true);

    const [session, setSession] = useState("All Sessions");

    const config = {

        symbols: selectedSymbols,

        lotSize,

        maxTrades,

        risk,

        confidence,

        scanInterval,

        autoExecute,

        scannerEnabled,

        session

    };

    return (

        <div className="trade-settings">

            <h2>⚙ Ghost Trading Settings</h2>

            <div className="setting-row">

                <label>Selected Symbols</label>

                <div className="selected-symbols">

                    {

                        selectedSymbols.length === 0

                        ?

                        "No Symbols Selected"

                        :

                        selectedSymbols.join(", ")

                    }

                </div>

            </div>

            <div className="setting-row">

                <label>Lot Size</label>

                <select

                    value={lotSize}

                    onChange={(e)=>setLotSize(Number(e.target.value))}

                >

                    <option value={0.01}>0.01</option>

                    <option value={0.02}>0.02</option>

                    <option value={0.05}>0.05</option>

                    <option value={0.10}>0.10</option>

                    <option value={0.20}>0.20</option>

                    <option value={0.50}>0.50</option>

                    <option value={1}>1.00</option>

                </select>

            </div>

            <div className="setting-row">

                <label>Maximum Trades</label>

                <input

                    type="number"

                    min="1"

                    max="20"

                    value={maxTrades}

                    onChange={(e)=>setMaxTrades(Number(e.target.value))}

                />

            </div>

            <div className="setting-row">

                <label>Risk Level</label>

                <select

                    value={risk}

                    onChange={(e)=>setRisk(e.target.value)}

                >

                    <option>Low</option>

                    <option>Medium</option>

                    <option>High</option>

                    <option>Aggressive</option>

                </select>

            </div>

            <div className="setting-row">

                <label>Minimum AI Confidence (%)</label>

                <input

                    type="range"

                    min="50"

                    max="100"

                    value={confidence}

                    onChange={(e)=>setConfidence(Number(e.target.value))}

                />

                <span>{confidence}%</span>

            </div>

            <div className="setting-row">

                <label>Scan Interval (seconds)</label>

                <input

                    type="number"

                    min="1"

                    max="60"

                    value={scanInterval}

                    onChange={(e)=>setScanInterval(Number(e.target.value))}

                />

            </div>

            <div className="setting-row">

                <label>Trading Session</label>

                <select

                    value={session}

                    onChange={(e)=>setSession(e.target.value)}

                >

                    <option>All Sessions</option>

                    <option>London</option>

                    <option>New York</option>

                    <option>Tokyo</option>

                    <option>Sydney</option>

                </select>

            </div>

            <div className="switch-row">

                <label>Ghost AI Scanner</label>

                <input

                    type="checkbox"

                    checked={scannerEnabled}

                    onChange={()=>setScannerEnabled(!scannerEnabled)}

                />

            </div>

            <div className="switch-row">

                <label>Auto Execute</label>

                <input

                    type="checkbox"

                    checked={autoExecute}

                    onChange={()=>setAutoExecute(!autoExecute)}

                />

            </div>

            <SaveQuotes config={config}/>

        </div>

    );

}
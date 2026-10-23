import React, { useState } from "react";
import "./SaveQuotes.css";

export default function SaveQuotes({ config }) {

    const [saved, setSaved] = useState(false);

    function saveConfiguration() {

        try {

            localStorage.setItem(
                "ghost_quotes",
                JSON.stringify(config)
            );

            setSaved(true);

            setTimeout(() => {

                setSaved(false);

            }, 2500);

        }
        catch (error) {

            console.error(error);

            alert("Unable to save Quotes settings.");

        }

    }

    return (

        <div className="save-quotes">

            <button
                className="save-btn"
                onClick={saveConfiguration}
            >

                💾 Save Trading Configuration

            </button>

            {saved && (

                <div className="save-success">

                    ✅ Configuration Saved Successfully

                </div>

            )}

            <div className="summary-card">

                <h3>Ghost Trading Summary</h3>

                <div className="summary-row">

                    <span>Selected Symbols</span>

                    <strong>

                        {config.symbols.length}

                    </strong>

                </div>

                <div className="summary-row">

                    <span>Lot Size</span>

                    <strong>

                        {config.lotSize}

                    </strong>

                </div>

                <div className="summary-row">

                    <span>Maximum Trades</span>

                    <strong>

                        {config.maxTrades}

                    </strong>

                </div>

                <div className="summary-row">

                    <span>Risk</span>

                    <strong>

                        {config.risk}

                    </strong>

                </div>

                <div className="summary-row">

                    <span>AI Confidence</span>

                    <strong>

                        {config.confidence}%

                    </strong>

                </div>

                <div className="summary-row">

                    <span>Scanner</span>

                    <strong>

                        {config.scannerEnabled ? "ON" : "OFF"}

                    </strong>

                </div>

                <div className="summary-row">

                    <span>Auto Execute</span>

                    <strong>

                        {config.autoExecute ? "ON" : "OFF"}

                    </strong>

                </div>

                <div className="summary-row">

                    <span>Trading Session</span>

                    <strong>

                        {config.session}

                    </strong>

                </div>

            </div>

        </div>

    );

}
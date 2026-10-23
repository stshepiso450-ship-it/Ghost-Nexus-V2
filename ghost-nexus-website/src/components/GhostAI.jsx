import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function GhostAI() {
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState("CONNECTING");
  const [symbol, setSymbol] = useState("XAUUSD");
  const [loading, setLoading] = useState(false);

  const scanMarket = async (selectedSymbol = symbol) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/ai/scan?symbol=${encodeURIComponent(
          selectedSymbol
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("AI scanner unavailable");
      }

      const data = await response.json();

      setAnalysis(data);
      setStatus("LIVE");
    } catch {
      setStatus("WAITING");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scanMarket();

    const interval = setInterval(
      () => scanMarket(),
      15000
    );

    return () => clearInterval(interval);
  }, []);

  const direction =
    analysis?.direction ||
    analysis?.signal ||
    analysis?.bias ||
    "WAITING";

  const score =
    analysis?.score ??
    analysis?.confidence ??
    "--";

  const trend =
    analysis?.trend ||
    analysis?.market_trend ||
    "Waiting for analysis";

  const reason =
    analysis?.reason ||
    analysis?.analysis ||
    analysis?.message ||
    "Ghost AI is waiting for live market data.";

  return (
    <section
      className="ghost-ai-section"
      aria-labelledby="ghost-ai-title"
    >
      <div className="ghost-ai-container">

        <div className="ghost-ai-header">

          <div>
            <span className="ghost-section-kicker">
              ARTIFICIAL MARKET INTELLIGENCE
            </span>

            <h2 id="ghost-ai-title">
              Ghost AI Scanner
            </h2>

            <p>
              Analyze live market conditions using
              Ghost Nexus technical and market
              intelligence infrastructure.
            </p>
          </div>

          <div className="ghost-calendar-status">
            <span
              className={`ghost-chart-dot ${status.toLowerCase()}`}
            />

            {status}
          </div>

        </div>

        <div className="ghost-ai-grid">

          {/* AI CORE */}
          <div className="ghost-ai-core-panel">

            <div className="ghost-ai-orb">
              <span>G</span>
            </div>

            <div className="ghost-ai-core-label">
              GHOST AI
            </div>

            <span className="ghost-ai-core-status">
              {loading
                ? "SCANNING..."
                : "MARKET ENGINE READY"}
            </span>

          </div>

          {/* ANALYSIS */}
          <div className="ghost-ai-analysis">

            <div className="ghost-ai-controls">

              <label htmlFor="ghost-ai-symbol">
                MARKET
              </label>

              <select
                id="ghost-ai-symbol"
                value={symbol}
                onChange={(event) =>
                  setSymbol(event.target.value)
                }
              >
                <option value="XAUUSD">
                  XAUUSD
                </option>

                <option value="EURUSD">
                  EURUSD
                </option>

                <option value="GBPUSD">
                  GBPUSD
                </option>

                <option value="USDJPY">
                  USDJPY
                </option>
              </select>

              <button
                type="button"
                onClick={() => scanMarket()}
                disabled={loading}
              >
                {loading
                  ? "SCANNING"
                  : "SCAN MARKET"}
              </button>

            </div>

            <div className="ghost-ai-signal">

              <span>
                CURRENT BIAS
              </span>

              <strong>
                {String(direction).toUpperCase()}
              </strong>

            </div>

            <div className="ghost-ai-metrics">

              <div>
                <span>
                  CONFIDENCE
                </span>

                <strong>
                  {score}
                </strong>
              </div>

              <div>
                <span>
                  TREND
                </span>

                <strong>
                  {trend}
                </strong>
              </div>

            </div>

            <div className="ghost-ai-reason">

              <span>
                AI ANALYSIS
              </span>

              <p>
                {reason}
              </p>

            </div>

          </div>

        </div>

        <div className="ghost-ai-disclaimer">
          <strong>
            AI TRADING NOTICE:
          </strong>

          <span>
            Ghost AI analysis is informational and
            does not guarantee trading results.
            Always verify market conditions and
            manage risk before executing trades.
          </span>
        </div>

      </div>
    </section>
  );
}
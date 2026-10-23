import React, { useEffect, useMemo, useState } from "react";
import "../styles/dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const DEFAULT_SYMBOLS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "AUDUSD",
  "USDCAD",
  "USDCHF",
  "XAUUSD",
  "EURGBP",
  "EURJPY",
  "GBPJPY",
  "AUDJPY",
  "NZDUSD",
];

export default function HeatMap() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("CONNECTING");
  const [timeframe, setTimeframe] = useState("1H");

  useEffect(() => {
    let mounted = true;

    const loadHeatMap = async () => {
      try {
        const response = await fetch(
          `${API_URL}/market/heatmap?timeframe=${encodeURIComponent(
            timeframe
          )}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Heat map unavailable");
        }

        const result = await response.json();

        if (!mounted) return;

        const incoming =
          Array.isArray(result)
            ? result
            : result.data ||
              result.symbols ||
              result.heatmap ||
              [];

        setData(incoming);
        setStatus("LIVE");
      } catch {
        if (mounted) {
          setStatus("WAITING");
        }
      }
    };

    loadHeatMap();

    const interval = setInterval(
      loadHeatMap,
      10000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [timeframe]);

  const normalizedData = useMemo(() => {
    const map = new Map();

    data.forEach((item) => {
      const symbol =
        item.symbol ||
        item.name ||
        item.instrument;

      if (!symbol) return;

      map.set(
        symbol.toUpperCase(),
        {
          symbol: symbol.toUpperCase(),

          change:
            item.change ??
            item.change_percent ??
            item.changePercent ??
            null,

          strength:
            item.strength ??
            item.score ??
            null,

          direction:
            item.direction ||
            item.trend ||
            "NEUTRAL",
        }
      );
    });

    return DEFAULT_SYMBOLS.map(
      (symbol) =>
        map.get(symbol) || {
          symbol,
          change: null,
          strength: null,
          direction: "NEUTRAL",
        }
    );
  }, [data]);

  const getHeatClass = (item) => {
    const direction =
      String(item.direction).toUpperCase();

    const numericChange =
      Number(item.change);

    if (
      direction === "BULLISH" ||
      direction === "UP" ||
      numericChange > 0
    ) {
      return "positive";
    }

    if (
      direction === "BEARISH" ||
      direction === "DOWN" ||
      numericChange < 0
    ) {
      return "negative";
    }

    return "neutral";
  };

  const formatChange = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "--";
    }

    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
      return String(value);
    }

    return `${numeric > 0 ? "+" : ""}${numeric.toFixed(
      2
    )}%`;
  };

  return (
    <section
      className="ghost-heatmap-section"
      aria-labelledby="heatmap-title"
    >
      <div className="ghost-heatmap-container">

        <div className="ghost-heatmap-header">

          <div>
            <span className="ghost-section-kicker">
              MARKET STRENGTH
            </span>

            <h2 id="heatmap-title">
              Forex Heat Map
            </h2>

            <p>
              Visualize relative market strength and
              weakness across major forex instruments.
            </p>
          </div>

          <div className="ghost-calendar-status">

            <span
              className={`ghost-chart-dot ${status.toLowerCase()}`}
            />

            {status}

          </div>

        </div>

        <div className="ghost-heatmap-controls">

          {["15M", "1H", "4H", "1D"].map(
            (item) => (
              <button
                key={item}
                type="button"
                className={
                  timeframe === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setTimeframe(item)
                }
              >
                {item}
              </button>
            )
          )}

        </div>

        <div className="ghost-heatmap-grid">

          {normalizedData.map(
            (item) => (
              <article
                key={item.symbol}
                className={`ghost-heatmap-cell ${getHeatClass(
                  item
                )}`}
              >

                <strong>
                  {item.symbol}
                </strong>

                <span>
                  {formatChange(
                    item.change
                  )}
                </span>

                <small>
                  {String(
                    item.direction
                  ).toUpperCase()}
                </small>

              </article>
            )
          )}

        </div>

        <div className="ghost-heatmap-legend">

          <span>
            MARKET STRENGTH
          </span>

          <div className="ghost-heatmap-legend-items">

            <span>
              WEAK
            </span>

            <span>
              NEUTRAL
            </span>

            <span>
              STRONG
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}
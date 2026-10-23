import React, { useEffect, useRef, useState } from "react";
import "../styles/app.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const symbols = [
  "XAUUSD",
  "EURUSD",
  "GBPUSD",
  "USDJPY",
];

export default function TradingChart() {
  const canvasRef = useRef(null);

  const [symbol, setSymbol] =
    useState("XAUUSD");

  const [timeframe, setTimeframe] =
    useState("15m");

  const [price, setPrice] =
    useState(null);

  const [change, setChange] =
    useState(null);

  const [connection, setConnection] =
    useState("CONNECTING");

  const [points, setPoints] =
    useState([]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/market/quotes`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("API unavailable");
        }

        const result =
          await response.json();

        const data =
          Array.isArray(result)
            ? result
            : result.markets ||
              result.quotes ||
              result.data ||
              [];

        const item = data.find(
          (entry) =>
            String(
              entry.symbol ||
                entry.instrument ||
                ""
            ).toUpperCase() === symbol
        );

        if (!item) {
          setConnection("WAITING");
          return;
        }

        const nextPrice =
          Number(
            item.price ??
              item.bid ??
              item.last
          );

        if (
          !Number.isFinite(nextPrice)
        ) {
          return;
        }

        if (!mounted) return;

        setPrice(nextPrice);

        setChange(
          item.change ??
            item.change_percent ??
            item.changePercent ??
            null
        );

        setConnection("LIVE");

        setPoints((current) => {
          const updated = [
            ...current,
            nextPrice,
          ];

          return updated.slice(-60);
        });
      } catch {
        if (mounted) {
          setConnection("WAITING");
        }
      }
    };

    loadData();

    const interval = setInterval(
      loadData,
      5000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [symbol]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || points.length < 2) {
      return;
    }

    const ctx =
      canvas.getContext("2d");

    const width = canvas.width =
      canvas.clientWidth *
      window.devicePixelRatio;

    const height = canvas.height =
      canvas.clientHeight *
      window.devicePixelRatio;

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    const values = points;

    const min = Math.min(...values);
    const max = Math.max(...values);

    const range =
      max - min || 1;

    ctx.beginPath();

    values.forEach(
      (value, index) => {
        const x =
          (index /
            (values.length - 1)) *
          width;

        const y =
          height -
          ((value - min) /
            range) *
            (height * 0.8) -
          height * 0.1;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    );

    ctx.lineWidth =
      2 *
      window.devicePixelRatio;

    ctx.strokeStyle =
      "#ff3030";

    ctx.shadowBlur = 10;
    ctx.shadowColor =
      "rgba(255,48,48,0.5)";

    ctx.stroke();

    ctx.shadowBlur = 0;
  }, [points]);

  const positive =
    Number(change) > 0;

  const negative =
    Number(change) < 0;

  return (
    <section
      className="ghost-chart-section"
      aria-labelledby="trading-chart-title"
    >
      <div className="ghost-chart-container">

        <div className="ghost-chart-header">

          <div>
            <span className="ghost-section-kicker">
              LIVE MARKET CHART
            </span>

            <h2 id="trading-chart-title">
              {symbol}
            </h2>
          </div>

          <div
            className={`ghost-chart-status ${
              connection.toLowerCase()
            }`}
          >
            <span />
            {connection}
          </div>

        </div>

        <div className="ghost-chart-toolbar">

          <div className="ghost-chart-symbols">
            {symbols.map(
              (item) => (
                <button
                  type="button"
                  key={item}
                  className={
                    symbol === item
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setSymbol(item);
                    setPoints([]);
                  }}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="ghost-chart-timeframes">
            {[
              "5m",
              "15m",
              "1H",
              "4H",
              "1D",
            ].map(
              (item) => (
                <button
                  type="button"
                  key={item}
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

        </div>

        <div className="ghost-chart-price-row">

          <div>
            <strong>
              {price !== null
                ? price.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits:
                        symbol === "XAUUSD"
                          ? 2
                          : 4,
                      maximumFractionDigits:
                        symbol === "XAUUSD"
                          ? 2
                          : 5,
                    }
                  )
                : "--"}
            </strong>

            <span>
              {timeframe}
            </span>
          </div>

          <div
            className={
              positive
                ? "positive"
                : negative
                ? "negative"
                : ""
            }
          >
            {change !== null
              ? `${
                  positive ? "+" : ""
                }${Number(change).toFixed(
                  2
                )}%`
              : "--"}
          </div>

        </div>

        <div className="ghost-chart-canvas-wrap">

          <canvas
            ref={canvasRef}
          />

          {points.length < 2 && (
            <div className="ghost-chart-empty">
              Waiting for live market data...
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
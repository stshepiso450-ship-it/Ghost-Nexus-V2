import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";

const initialMarkets = [
  {
    symbol: "XAUUSD",
    name: "Gold",
    price: "3,342.20",
    change: "+0.84%",
    positive: true,
    icon: "Au",
  },
  {
    symbol: "EURUSD",
    name: "Euro / Dollar",
    price: "1.1712",
    change: "+0.21%",
    positive: true,
    icon: "€",
  },
  {
    symbol: "GBPUSD",
    name: "Pound / Dollar",
    price: "1.3564",
    change: "-0.14%",
    positive: false,
    icon: "£",
  },
  {
    symbol: "USDJPY",
    name: "Dollar / Yen",
    price: "148.42",
    change: "+0.31%",
    positive: true,
    icon: "¥",
  },
];

const chartPoints = `
  M 0 220
  C 30 205, 55 225, 85 190
  S 130 175, 155 195
  S 205 135, 235 155
  S 280 110, 315 135
  S 360 100, 390 120
  S 430 75, 465 95
  S 510 120, 540 80
  S 590 95, 620 65
  S 660 85, 700 45
  S 745 65, 780 30
  S 820 55, 850 25
  S 900 45, 930 15
  L 930 300
  L 0 300
  Z
`;

const chartLine = `
  M 0 220
  C 30 205, 55 225, 85 190
  S 130 175, 155 195
  S 205 135, 235 155
  S 280 110, 315 135
  S 360 100, 390 120
  S 430 75, 465 95
  S 510 120, 540 80
  S 590 95, 620 65
  S 660 85, 700 45
  S 745 65, 780 30
  S 820 55, 850 25
  S 900 45, 930 15
`;

const miniCharts = [
  `
    M0 35
    C20 30, 35 36, 50 26
    S75 29, 90 18
    S115 24, 135 10
  `,
  `
    M0 20
    C20 25, 35 18, 55 25
    S80 18, 100 30
    S120 24, 140 35
  `,
  `
    M0 35
    C20 30, 35 33, 50 25
    S75 30, 90 16
    S115 22, 140 8
  `,
  `
    M0 30
    C20 22, 35 30, 55 18
    S80 22, 100 14
    S120 18, 140 7
  `,
];

function LiveDashboard() {
  const [markets, setMarkets] = useState(initialMarkets);

  const [viewers, setViewers] = useState(127);

  const [lastUpdated, setLastUpdated] = useState(
    "Just now"
  );

  /*
   * -------------------------------------------------------
   * PUBLIC DEMO MARKET REFRESH
   *
   * This keeps the website visually alive while the real
   * market websocket/API is being connected.
   *
   * Later this can be replaced with:
   * services/market.js
   * services/websocket.js
   * -------------------------------------------------------
   */

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((currentMarkets) =>
        currentMarkets.map((market) => {
          const numericPrice = parseFloat(
            market.price.replace(",", "")
          );

          const movement =
            (Math.random() - 0.5) *
            (numericPrice > 100 ? 1.2 : 0.0015);

          const newPrice =
            numericPrice + movement;

          const decimals =
            market.symbol === "XAUUSD"
              ? 2
              : 4;

          const formattedPrice =
            newPrice.toLocaleString(
              "en-US",
              {
                minimumFractionDigits:
                  decimals,
                maximumFractionDigits:
                  decimals,
              }
            );

          return {
            ...market,
            price: formattedPrice,
          };
        })
      );

      setViewers((current) => {
        const movement =
          Math.floor(Math.random() * 9) - 4;

        const next =
          current + movement;

        return Math.max(1, next);
      });

      setLastUpdated("Live");
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const gold =
    markets.find(
      (market) => market.symbol === "XAUUSD"
    ) || markets[0];

  return (
    <section
      className="ghost-live-dashboard"
      id="markets"
      aria-label="Ghost Nexus live market dashboard"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="ghost-live-dashboard-header">

        <div className="ghost-live-dashboard-heading">

          <div className="ghost-live-dashboard-eyebrow">

            <span className="ghost-live-dashboard-eyebrow-dot" />

            Ghost Nexus Live Markets

          </div>

          <h2 className="ghost-live-dashboard-title">
            Markets move.
            <br />

            <span>Ghost Nexus watches.</span>
          </h2>

          <p className="ghost-live-dashboard-description">
            Follow live market conditions, price movements
            and trading activity from one powerful market
            intelligence interface.
          </p>

        </div>

        <div className="ghost-live-dashboard-status">

          <span className="ghost-live-dashboard-status-dot" />

          Markets Online

        </div>

      </div>


      {/* =================================================
          MARKET CARDS
      ================================================= */}

      <div className="ghost-market-grid">

        {markets.map((market, index) => (
          <article
            className="ghost-market-card"
            key={market.symbol}
          >

            <div className="ghost-market-card-top">

              <div className="ghost-market-symbol">

                <span className="ghost-market-icon">
                  {market.icon}
                </span>

                {market.symbol}

              </div>

              <div className="ghost-market-market-status">

                <span className="ghost-market-market-status-dot" />

                Live

              </div>

            </div>


            <div className="ghost-market-price">
              {market.price}
            </div>


            <div
              className={`ghost-market-change ${
                market.positive
                  ? "positive"
                  : "negative"
              }`}
            >

              <span>
                {market.positive ? "↗" : "↘"}
              </span>

              {market.change}

            </div>


            <div className="ghost-mini-chart">

              <svg
                viewBox="0 0 140 45"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  className="ghost-mini-chart-line"
                  d={miniCharts[index]}
                />
              </svg>

            </div>

          </article>
        ))}

      </div>


      {/* =================================================
          MAIN PUBLIC MARKET PANEL
      ================================================= */}

      <div className="ghost-live-panel">

        {/* ===============================================
            CHART
        =============================================== */}

        <div className="ghost-live-chart">

          <div className="ghost-live-chart-header">

            <div className="ghost-live-chart-title">

              <span className="ghost-live-chart-title-icon">
                ✦
              </span>

              Live Market Overview

            </div>

            <div className="ghost-live-chart-time">
              {lastUpdated}
            </div>

          </div>


          <div className="ghost-public-chart">

            <svg
              viewBox="0 0 930 300"
              preserveAspectRatio="none"
              aria-label="Market price movement chart"
            >

              <defs>

                <linearGradient
                  id="ghostChartGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#ff1744"
                    stopOpacity="0.45"
                  />

                  <stop
                    offset="100%"
                    stopColor="#ff1744"
                    stopOpacity="0"
                  />

                </linearGradient>

              </defs>


              <path
                className="ghost-public-chart-area"
                d={chartPoints}
              />


              <path
                className="ghost-public-chart-line"
                d={chartLine}
              />

            </svg>


            <div className="ghost-chart-watermark">
              GHOST NEXUS
            </div>

          </div>

        </div>


        {/* ===============================================
            MARKET INFORMATION
        =============================================== */}

        <aside className="ghost-market-info">

          <div className="ghost-market-info-title">
            Featured Market
          </div>


          <div className="ghost-market-info-symbol">
            {gold.symbol}
          </div>


          <div className="ghost-market-info-price">
            {gold.price}
          </div>


          <div className="ghost-market-info-change">
            {gold.change} today
          </div>


          <div className="ghost-market-divider" />


          <div className="ghost-market-data">

            <div className="ghost-market-data-row">
              <span>Instrument</span>
              <strong>Gold / USD</strong>
            </div>

            <div className="ghost-market-data-row">
              <span>Market</span>
              <strong>Forex / Metals</strong>
            </div>

            <div className="ghost-market-data-row">
              <span>Session</span>
              <strong>Active</strong>
            </div>

            <div className="ghost-market-data-row">
              <span>Feed</span>
              <strong>Live</strong>
            </div>

          </div>


          {/* =============================================
              VIEWER COUNTER
          ============================================= */}

          <div
            className="ghost-live-viewers"
            title="People currently viewing Ghost Nexus"
          >

            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>

            <span>
              <span className="ghost-live-viewers-number">
                {viewers}
              </span>{" "}
              people viewing

            </span>

          </div>

        </aside>

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="ghost-live-dashboard-footer">

        <span>
          <span className="ghost-live-dashboard-footer-dot" />
          Live market interface
        </span>

        <span>
          Data updates automatically
        </span>

        <span>
          Ghost Nexus Intelligence
        </span>

      </div>

    </section>
  );
}

export default LiveDashboard;
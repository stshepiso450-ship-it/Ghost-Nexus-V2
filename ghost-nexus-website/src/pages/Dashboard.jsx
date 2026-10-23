import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/dashboard.css";


/* =========================================================
   GHOST NEXUS PUBLIC WEBSITE DASHBOARD
   ---------------------------------------------------------
   This is the PUBLIC website dashboard.

   It does NOT expose:
   - MT5 credentials
   - Account information
   - Positions
   - Orders
   - EA controls
   - Bot controls
   - Private AI scanner
   - Trading settings

   Those belong to the Ghost Nexus application.
========================================================= */


/* =========================================================
   API
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


/* =========================================================
   PUBLIC MARKET SYMBOLS
========================================================= */

const symbols = [
  {
    symbol: "XAUUSD",
    name: "Gold / US Dollar",
    icon: "Au",
  },
  {
    symbol: "EURUSD",
    name: "Euro / US Dollar",
    icon: "€",
  },
  {
    symbol: "GBPUSD",
    name: "Pound / US Dollar",
    icon: "£",
  },
  {
    symbol: "USDJPY",
    name: "US Dollar / Japanese Yen",
    icon: "¥",
  },
];


/* =========================================================
   HELPERS
========================================================= */

function findQuote(list, symbol) {
  return list.find(
    (item) =>
      String(item?.symbol || "").toUpperCase() ===
      symbol
  );
}


function getPrice(quote) {
  if (!quote) return null;

  return (
    quote.price ??
    quote.bid ??
    quote.last ??
    quote.close ??
    null
  );
}


function getChange(quote) {
  if (!quote) return null;

  return (
    quote.change_percent ??
    quote.changePercent ??
    quote.change ??
    quote.percent_change ??
    null
  );
}


function formatPrice(value, symbol) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "--";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  let decimals = 4;

  if (symbol === "XAUUSD") {
    decimals = 2;
  }

  if (symbol === "USDJPY") {
    decimals = 3;
  }

  return number.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}


function formatChange(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "--";
  }

  const number = Number(
    String(value).replace("%", "")
  );

  if (Number.isNaN(number)) {
    return String(value);
  }

  const prefix = number > 0 ? "+" : "";

  return `${prefix}${number.toFixed(2)}%`;
}


function isPositive(value) {
  const number = Number(
    String(value ?? "").replace("%", "")
  );

  return number >= 0;
}


/* =========================================================
   MINI CHARTS
========================================================= */

const miniCharts = [
  "M0 35 C20 30 35 36 50 26 S75 29 90 18 S115 24 140 10",

  "M0 20 C20 25 35 18 55 25 S80 18 100 30 S120 24 140 35",

  "M0 35 C20 30 35 33 50 25 S75 30 90 16 S115 22 140 8",

  "M0 30 C20 22 35 30 55 18 S80 22 100 14 S120 18 140 7",
];


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Dashboard() {

  const [quotes, setQuotes] = useState({});

  const [connection, setConnection] =
    useState("CONNECTING");

  const [viewerCount, setViewerCount] =
    useState(null);

  const [lastUpdated, setLastUpdated] =
    useState(null);


  /* =======================================================
     LOAD PUBLIC MARKET DATA
  ======================================================= */

  useEffect(() => {

    let mounted = true;

    const loadQuotes = async () => {

      try {

        const response = await fetch(
          `${API_URL}/market/quotes`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Market API returned ${response.status}`
          );
        }

        const data =
          await response.json();

        if (!mounted) return;

        const list =
          Array.isArray(data)
            ? data
            : data?.quotes ||
              data?.markets ||
              data?.data ||
              [];

        const mapped = {};

        list.forEach((item) => {

          const symbol =
            String(
              item?.symbol || ""
            ).toUpperCase();

          if (symbol) {
            mapped[symbol] = item;
          }

        });

        setQuotes(mapped);

        setConnection("LIVE");

        setLastUpdated(
          new Date()
        );

      } catch (error) {

        console.warn(
          "Ghost Nexus market feed unavailable:",
          error
        );

        if (mounted) {
          setConnection("WAITING");
        }

      }

    };


    loadQuotes();

    const interval =
      setInterval(
        loadQuotes,
        5000
      );


    return () => {

      mounted = false;

      clearInterval(interval);

    };

  }, []);


  /* =======================================================
     LOAD REAL WEBSITE VIEWERS
  ======================================================= */

  useEffect(() => {

    let mounted = true;

    const loadViewers = async () => {

      try {

        const response = await fetch(
          `${API_URL}/analytics/viewers`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Viewer API returned ${response.status}`
          );
        }

        const data =
          await response.json();

        if (!mounted) return;

        const count =
          data?.viewers ??
          data?.count ??
          data?.online ??
          null;

        setViewerCount(count);

      } catch (error) {

        console.warn(
          "Ghost Nexus viewer counter unavailable:",
          error
        );

        if (mounted) {
          setViewerCount(null);
        }

      }

    };


    loadViewers();

    const interval =
      setInterval(
        loadViewers,
        10000
      );


    return () => {

      mounted = false;

      clearInterval(interval);

    };

  }, []);


  /* =======================================================
     PREPARE MARKET DATA
  ======================================================= */

  const marketData = useMemo(() => {

    return symbols.map(
      (market) => {

        const quote =
          quotes[market.symbol];

        const price =
          getPrice(quote);

        const change =
          getChange(quote);

        return {
          ...market,
          quote,
          price,
          change,
          formattedPrice:
            formatPrice(
              price,
              market.symbol
            ),
          formattedChange:
            formatChange(change),
          positive:
            isPositive(change),
        };

      }
    );

  }, [quotes]);


  /* =======================================================
     FEATURED MARKET
  ======================================================= */

  const featuredMarket =
    marketData.find(
      (market) =>
        market.symbol === "XAUUSD"
    ) || marketData[0];


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>

      {/* ===================================================
          SEO
      =================================================== */}

      <SEO
        title="Live Trading Dashboard"
        description="Explore the Ghost Nexus live market dashboard with live market information, trading intelligence, market prices and platform activity."
        path="/dashboard"
      />


      {/* ===================================================
          NAVBAR
      =================================================== */}

      <Navbar />


      {/* ===================================================
          PAGE
      =================================================== */}

      <main className="ghost-live-dashboard">


        {/* =================================================
            HEADER
        ================================================= */}

        <section className="ghost-live-dashboard-header">

          <div className="ghost-live-dashboard-heading">

            <div className="ghost-live-dashboard-eyebrow">

              <span className="ghost-live-dashboard-eyebrow-dot" />

              Ghost Nexus Live Markets

            </div>


            <h1 className="ghost-live-dashboard-title">

              Markets move.
              <br />

              <span>
                Ghost Nexus watches.
              </span>

            </h1>


            <p className="ghost-live-dashboard-description">

              Monitor live public market information,
              price movements and Ghost Nexus platform
              activity from one intelligent interface.

            </p>

          </div>


          {/* SYSTEM STATUS */}

          <div className="ghost-live-dashboard-status">

            <span className="ghost-live-dashboard-status-dot" />

            {connection === "LIVE"
              ? "Markets Online"
              : "Connecting"}

          </div>

        </section>


        {/* =================================================
            MARKET CARDS
        ================================================= */}

        <section
          className="ghost-market-grid"
          aria-label="Live markets"
        >

          {marketData.map(
            (market, index) => (

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

                  {market.formattedPrice}

                </div>


                <div
                  className={`ghost-market-change ${
                    market.positive
                      ? "positive"
                      : "negative"
                  }`}
                >

                  <span>
                    {market.positive
                      ? "↗"
                      : "↘"}
                  </span>

                  {market.formattedChange}

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

            )
          )}

        </section>


        {/* =================================================
            MAIN LIVE PANEL
        ================================================= */}

        <section className="ghost-live-panel">


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

                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString()}`
                  : "Waiting for feed"}

              </div>

            </div>


            <div className="ghost-public-chart">

              <svg
                viewBox="0 0 930 300"
                preserveAspectRatio="none"
                aria-label="Ghost Nexus market chart"
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
                      stopOpacity="0.4"
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
                  d="
                    M0 220
                    C30 205 55 225 85 190
                    S130 175 155 195
                    S205 135 235 155
                    S280 110 315 135
                    S360 100 390 120
                    S430 75 465 95
                    S510 120 540 80
                    S590 95 620 65
                    S660 85 700 45
                    S745 65 780 30
                    S820 55 850 25
                    S900 45 930 15
                    L930 300
                    L0 300
                    Z
                  "
                />


                <path
                  className="ghost-public-chart-line"
                  d="
                    M0 220
                    C30 205 55 225 85 190
                    S130 175 155 195
                    S205 135 235 155
                    S280 110 315 135
                    S360 100 390 120
                    S430 75 465 95
                    S510 120 540 80
                    S590 95 620 65
                    S660 85 700 45
                    S745 65 780 30
                    S820 55 850 25
                    S900 45 930 15
                  "
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

              {featuredMarket?.symbol ||
                "XAUUSD"}

            </div>


            <div className="ghost-market-info-price">

              {featuredMarket?.formattedPrice ||
                "--"}

            </div>


            <div
              className={
                featuredMarket?.positive
                  ? "ghost-market-info-change"
                  : "ghost-market-info-change negative"
              }
            >

              {featuredMarket?.formattedChange ||
                "--"}

              {" "}today

            </div>


            <div className="ghost-market-divider" />


            <div className="ghost-market-data">

              <div className="ghost-market-data-row">

                <span>
                  Instrument
                </span>

                <strong>
                  Gold / USD
                </strong>

              </div>


              <div className="ghost-market-data-row">

                <span>
                  Market
                </span>

                <strong>
                  Forex / Metals
                </strong>

              </div>


              <div className="ghost-market-data-row">

                <span>
                  Feed
                </span>

                <strong>
                  {connection === "LIVE"
                    ? "Live"
                    : "Waiting"}
                </strong>

              </div>


              <div className="ghost-market-data-row">

                <span>
                  Update
                </span>

                <strong>
                  5 sec
                </strong>

              </div>

            </div>


            {/* =============================================
                LIVE VIEWER COUNTER
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

                <circle
                  cx="12"
                  cy="12"
                  r="2.5"
                />

              </svg>


              <span>

                <span className="ghost-live-viewers-number">

                  {viewerCount !== null
                    ? viewerCount
                    : "—"}

                </span>

                {" "}
                people viewing

              </span>

            </div>

          </aside>

        </section>


        {/* =================================================
            PUBLIC WEBSITE INFORMATION
        ================================================= */}

        <section className="ghost-live-dashboard-footer">

          <span>

            <span className="ghost-live-dashboard-footer-dot" />

            Public market information

          </span>


          <span>

            {connection === "LIVE"
              ? "Market feed connected"
              : "Waiting for market feed"}

          </span>


          <span>

            Ghost Nexus Intelligence

          </span>

        </section>


        {/* =================================================
            WEBSITE ACTIONS
        ================================================= */}

        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "28px",
            flexWrap: "wrap",
          }}
        >

          <Link
            to="/pricing"
            className="ghost-primary-button"
          >
            VIEW PRICING
            <span>→</span>
          </Link>


          <Link
            to="/download"
            className="ghost-secondary-button"
          >
            DOWNLOAD
          </Link>

        </section>

      </main>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <Footer />

    </>
  );
}
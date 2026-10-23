import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/footer.css";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const INITIAL_MARKETS = [
  {
    symbol: "XAUUSD",
    name: "Gold",
    price: null,
    change: null,
    direction: "waiting",
  },
  {
    symbol: "EURUSD",
    name: "Euro / USD",
    price: null,
    change: null,
    direction: "waiting",
  },
  {
    symbol: "GBPUSD",
    name: "Pound / USD",
    price: null,
    change: null,
    direction: "waiting",
  },
  {
    symbol: "USDJPY",
    name: "USD / Yen",
    price: null,
    change: null,
    direction: "waiting",
  },
  {
    symbol: "GBPJPY",
    name: "Pound / Yen",
    price: null,
    change: null,
    direction: "waiting",
  },
];

function normalizeMarkets(data) {
  if (!data) return INITIAL_MARKETS;

  const source =
    data.quotes ||
    data.markets ||
    data.data ||
    data;

  if (!source) return INITIAL_MARKETS;

  return INITIAL_MARKETS.map((market) => {
    let item = null;

    if (Array.isArray(source)) {
      item = source.find(
        (quote) =>
          String(
            quote.symbol ||
              quote.instrument ||
              quote.name ||
              ""
          ).toUpperCase() === market.symbol
      );
    } else if (typeof source === "object") {
      item =
        source[market.symbol] ||
        source[market.symbol.toLowerCase()] ||
        null;
    }

    if (!item) {
      return market;
    }

    const price =
      item.price ??
      item.bid ??
      item.ask ??
      item.last ??
      item.close ??
      null;

    const change =
      item.change ??
      item.change_percent ??
      item.changePercent ??
      item.percent_change ??
      null;

    let numericChange = null;

    if (change !== null && change !== undefined) {
      const parsed = Number(
        String(change).replace("%", "")
      );

      if (Number.isFinite(parsed)) {
        numericChange = parsed;
      }
    }

    return {
      ...market,
      price:
        price !== null && price !== undefined
          ? Number(price)
          : null,
      change: numericChange,
      direction:
        numericChange === null
          ? "waiting"
          : numericChange > 0
          ? "up"
          : numericChange < 0
          ? "down"
          : "flat",
    };
  });
}

function formatPrice(symbol, price) {
  if (price === null || price === undefined) {
    return "WAITING";
  }

  if (!Number.isFinite(Number(price))) {
    return "WAITING";
  }

  const decimals =
    symbol === "USDJPY" || symbol === "GBPJPY"
      ? 3
      : symbol === "XAUUSD"
      ? 2
      : 5;

  return Number(price).toFixed(decimals);
}

function formatChange(change) {
  if (change === null || change === undefined) {
    return "--";
  }

  const value = Number(change);

  if (!Number.isFinite(value)) {
    return "--";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export default function Footer() {
  const [markets, setMarkets] = useState(INITIAL_MARKETS);
  const [marketStatus, setMarketStatus] = useState("CONNECTING");
  const [lastUpdate, setLastUpdate] = useState(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let mounted = true;

    async function loadMarkets() {
      try {
        const response = await fetch(
          `${API_BASE}/market/quotes`,
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

        const data = await response.json();

        if (!mounted) return;

        setMarkets(normalizeMarkets(data));
        setMarketStatus("LIVE");
        setLastUpdate(new Date());
      } catch (error) {
        if (!mounted) return;

        setMarketStatus("OFFLINE");

        setMarkets((current) =>
          current.map((market) => ({
            ...market,
            price: null,
            change: null,
            direction: "waiting",
          }))
        );
      }
    }

    loadMarkets();

    const interval = setInterval(
      loadMarkets,
      10000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <footer className="ghost-footer">

      {/* MARKET TICKER */}
      <div className="ghost-footer-markets">
        <div className="ghost-footer-market-header">
          <div className="ghost-footer-market-title">
            <span className="market-pulse"></span>
            <span>LIVE MARKET</span>
          </div>

          <div
            className={`ghost-market-connection ${marketStatus.toLowerCase()}`}
          >
            {marketStatus}
          </div>
        </div>

        <div className="ghost-market-grid">
          {markets.map((market) => (
            <div
              className="ghost-market-card"
              key={market.symbol}
            >
              <div className="ghost-market-card-top">
                <span className="ghost-market-symbol">
                  {market.symbol}
                </span>

                <span className="ghost-market-name">
                  {market.name}
                </span>
              </div>

              <div className="ghost-market-price">
                {formatPrice(
                  market.symbol,
                  market.price
                )}
              </div>

              <div
                className={`ghost-market-change ${market.direction}`}
              >
                {formatChange(market.change)}
              </div>
            </div>
          ))}
        </div>

        {lastUpdate && (
          <div className="ghost-market-updated">
            Updated{" "}
            {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="ghost-footer-container">

        {/* MAIN FOOTER */}
        <div className="ghost-footer-top">

          {/* BRAND */}
          <div className="ghost-footer-brand">
            <div className="ghost-footer-logo">
              <span>GHOST</span>
              <strong>NEXUS</strong>
            </div>

            <p>
              A next-generation trading technology
              ecosystem built around market
              intelligence, AI and modern trading
              tools.
            </p>

            <div className="ghost-footer-socials">

              <a
                href="https://www.instagram.com/sebaputshepiso"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <span>IG</span>
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <span>f</span>
              </a>

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <span>YT</span>
              </a>

              <a
                href="https://t.me/GhostnexusAi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <span>TG</span>
              </a>

              <a
                href="https://www.tiktok.com/@GhostFX"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <span>TK</span>
              </a>

            </div>
          </div>

          {/* PLATFORM */}
          <div className="ghost-footer-column">
            <h3>Platform</h3>

            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/dashboard">
              Live Dashboard
            </Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/download">
              Download
            </Link>
          </div>

          {/* COMPANY */}
          <div className="ghost-footer-column">
            <h3>Company</h3>

            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about">
              About Ghost Nexus
            </Link>

            <Link
              to="/mentor/apply"
              className="footer-mentor-link"
            >
              Become a Mentor
            </Link>
          </div>

          {/* MENTOR */}
          <div className="ghost-footer-column footer-mentor-column">
            <h3>Mentor</h3>

            <p className="footer-mentor-description">
              Join the Ghost Nexus mentor network,
              create trading EAs and manage your
              clients.
            </p>

            <Link
              to="/login"
              className="footer-mentor-login"
            >
              <span>Mentor Login</span>
              <span className="footer-arrow">
                →
              </span>
            </Link>

            <Link
              to="/mentor/apply"
              className="footer-become-mentor"
            >
              <span>Become a Mentor</span>
              <span className="footer-arrow">
                →
              </span>
            </Link>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="ghost-footer-bottom">

          <div className="footer-copyright">
            © {currentYear}{" "}
            <strong>Ghost Nexus</strong>.
            All rights reserved.
          </div>

          <div className="ghost-footer-status">
            <span className="ghost-footer-status-dot"></span>
            <span>
              GHOST NEXUS SYSTEM
            </span>
          </div>

          <div className="footer-built">
            Built for the next generation.
          </div>

        </div>

      </div>
    </footer>
  );
}
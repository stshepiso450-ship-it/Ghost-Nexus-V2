import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  Clock3,
  Cpu,
  Globe2,
  Radio,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/Home.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const SYMBOLS = [
  "XAUUSD",
  "EURUSD",
  "GBPUSD",
  "USDJPY",
];

const FALLBACK_NAMES = {
  XAUUSD: "XAU/USD",
  EURUSD: "EUR/USD",
  GBPUSD: "GBP/USD",
  USDJPY: "USD/JPY",
};

/* =========================================================
   MARKET HELPERS
========================================================= */

function normaliseQuotes(payload) {
  const raw = Array.isArray(payload)
    ? payload
    : payload?.markets ||
      payload?.quotes ||
      payload?.data ||
      [];

  if (Array.isArray(raw)) {
    return raw;
  }

  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(
      ([symbol, value]) => ({
        symbol,
        ...(typeof value === "object"
          ? value
          : { price: value }),
      })
    );
  }

  return [];
}

function getSymbol(item) {
  return String(
    item?.symbol ||
      item?.instrument ||
      item?.name ||
      ""
  )
    .replace(/[/:_-]/g, "")
    .toUpperCase();
}

function getPrice(item) {
  const value = Number(
    item?.price ??
      item?.last ??
      item?.bid ??
      item?.ask
  );

  return Number.isFinite(value) ? value : null;
}

function getChange(item) {
  const value = Number(
    item?.changePercent ??
      item?.change_percent ??
      item?.change ??
      item?.percentage
  );

  return Number.isFinite(value) ? value : null;
}

function formatPrice(symbol, price) {
  if (price === null) {
    return "—";
  }

  const digits =
    symbol === "USDJPY"
      ? 3
      : symbol === "XAUUSD"
      ? 2
      : 5;

  return price.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/* =========================================================
   SPARKLINE
========================================================= */

function Sparkline({ values = [] }) {
  if (values.length < 2) {
    return (
      <div className="gn-spark-empty">
        <span />
        <span />
        <span />
      </div>
    );
  }

  const width = 240;
  const height = 64;
  const padding = 5;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x =
        padding +
        (index / (values.length - 1)) *
          (width - padding * 2);

      const y =
        height -
        padding -
        ((value - min) / range) *
          (height - padding * 2);

      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      className="gn-sparkline"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* =========================================================
   TRADINGVIEW
========================================================= */

function TradingViewPanel({ symbol }) {
  const tradingViewSymbol =
    symbol === "XAUUSD"
      ? "OANDA:XAUUSD"
      : symbol === "EURUSD"
      ? "FX:EURUSD"
      : symbol === "GBPUSD"
      ? "FX:GBPUSD"
      : "FX:USDJPY";

  const src =
    `https://www.tradingview.com/widgetembed/?` +
    `symbol=${encodeURIComponent(tradingViewSymbol)}` +
    `&interval=15` +
    `&hidesidetoolbar=0` +
    `&symboledit=1` +
    `&saveimage=0` +
    `&toolbarbg=%23060606` +
    `&theme=dark` +
    `&style=1` +
    `&timezone=Etc%2FUTC` +
    `&withdateranges=1` +
    `&hideideas=1` +
    `&locale=en`;

  return (
    <div className="gn-tradingview-frame">
      <iframe
        title={`TradingView ${symbol}`}
        src={src}
        loading="lazy"
        allow="fullscreen"
      />
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const [now, setNow] = useState(new Date());
  const [quotes, setQuotes] = useState([]);
  const [quoteStatus, setQuoteStatus] =
    useState("CONNECTING");

  const [selectedSymbol, setSelectedSymbol] =
    useState("XAUUSD");

  const [history, setHistory] = useState({});

  /* =======================================================
     CLOCK
  ======================================================= */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /* =======================================================
     LIVE MARKET API
  ======================================================= */

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    const loadQuotes = async () => {
      try {
        setQuoteStatus((current) =>
          current === "LIVE"
            ? "LIVE"
            : "CONNECTING"
        );

        const response = await fetch(
          `${API_URL}/market/quotes`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Market API returned ${response.status}`
          );
        }

        const payload = await response.json();

        const nextQuotes =
          normaliseQuotes(payload);

        if (cancelled) {
          return;
        }

        setQuotes(nextQuotes);

        setQuoteStatus(
          nextQuotes.length
            ? "LIVE"
            : "WAITING"
        );

        setHistory((current) => {
          const next = {
            ...current,
          };

          nextQuotes.forEach((item) => {
            const symbol = getSymbol(item);
            const price = getPrice(item);

            if (!symbol || price === null) {
              return;
            }

            next[symbol] = [
              ...(next[symbol] || []),
              price,
            ].slice(-40);
          });

          return next;
        });
      } catch (error) {
        console.warn(
          "Ghost Nexus market feed unavailable:",
          error
        );

        if (!cancelled) {
          setQuoteStatus("OFFLINE");
        }
      } finally {
        if (!cancelled) {
          timer = window.setTimeout(
            loadQuotes,
            3000
          );
        }
      }
    };

    loadQuotes();

    return () => {
      cancelled = true;

      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  /* =======================================================
     QUOTE MAP
  ======================================================= */

  const quoteMap = useMemo(() => {
    const map = {};

    quotes.forEach((item) => {
      const symbol = getSymbol(item);

      if (symbol) {
        map[symbol] = item;
      }
    });

    return map;
  }, [quotes]);

  const selectedQuote =
    quoteMap[selectedSymbol];

  const selectedPrice =
    getPrice(selectedQuote);

  const selectedChange =
    getChange(selectedQuote);

  /* =======================================================
     DATE / TIME
  ======================================================= */

  const liveDate = now.toLocaleDateString(
    undefined,
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  const liveTime = now.toLocaleTimeString(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <SEO
        title="Ghost Nexus | Intelligence Beyond Markets"
        description="Ghost Nexus connects live market intelligence, trading technology, AI tools and a global mentor ecosystem."
        path="/"
      />

      <Navbar />

      <main className="gn-home">

        {/* =================================================
            LIVE TICKER
        ================================================= */}

        <section
          className="gn-market-ticker"
          aria-label="Live market prices"
        >
          <div className="gn-ticker-live">
            <span className="gn-ticker-dot" />
            <span>LIVE MARKETS</span>
          </div>

          <div className="gn-ticker-track">
            <div className="gn-ticker-content">
              {[...SYMBOLS, ...SYMBOLS].map(
                (symbol, index) => {
                  const item =
                    quoteMap[symbol];

                  const price =
                    getPrice(item);

                  const change =
                    getChange(item);

                  return (
                    <div
                      className="gn-ticker-item"
                      key={`${symbol}-${index}`}
                    >
                      <strong>
                        {FALLBACK_NAMES[symbol]}
                      </strong>

                      <span>
                        {formatPrice(
                          symbol,
                          price
                        )}
                      </span>

                      <span
                        className={
                          change === null
                            ? ""
                            : change >= 0
                            ? "ticker-up"
                            : "ticker-down"
                        }
                      >
                        {change === null
                          ? "—"
                          : `${
                              change >= 0
                                ? "+"
                                : ""
                            }${change.toFixed(
                              2
                            )}%`}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="gn-home-hero">
          <div className="gn-hero-grid" />
          <div className="gn-hero-glow-one" />
          <div className="gn-hero-glow-two" />
          <div className="gn-hero-noise" />

          <div className="gn-hero-content">

            <div className="gn-status-pill">
              <span className="gn-status-dot" />
              GHOST NEXUS SYSTEM ONLINE
            </div>

            <div className="gn-live-time">
              <Clock3 size={15} />

              <span>
                {liveDate}
              </span>

              <strong>
                {liveTime}
              </strong>
            </div>

            <h1 className="gn-home-title">
              ENTER THE
              <span>GHOST</span>
              <em>NEXUS</em>
            </h1>

            <p className="gn-home-description">
              The digital command centre for
              market intelligence, trading
              technology, AI systems and the
              Ghost Nexus mentor network.
            </p>

            <div className="gn-home-actions">

              <Link
                to="/dashboard"
                className="gn-btn gn-btn-primary"
              >
                <Activity size={18} />
                EXPLORE MARKETS
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/mentor/apply"
                className="gn-btn gn-btn-mentor"
              >
                <Users size={18} />
                BECOME A MENTOR
                <ArrowRight size={18} />
              </Link>

            </div>

            <div className="gn-hero-trust">

              <div>
                <ShieldCheck size={17} />
                <span>
                  Secure Ecosystem
                </span>
              </div>

              <div>
                <Cpu size={17} />
                <span>
                  AI Technology
                </span>
              </div>

              <div>
                <Radio size={17} />
                <span>
                  Live Intelligence
                </span>
              </div>

            </div>

          </div>

          {/* GHOST VISUAL */}

          <div className="gn-ghost-visual">

            <div className="gn-ghost-orbit orbit-one" />
            <div className="gn-ghost-orbit orbit-two" />
            <div className="gn-ghost-red-light" />

            <div className="gn-ghost-image-wrapper">

              <img
                src="/ghost-nexus-skull.png"
                alt="Ghost Nexus Screamer Edition"
                className="gn-ghost-image"
              />

              <div className="gn-image-scanline" />

            </div>

            <div className="gn-ghost-label">
              <span>
                GHOST NEXUS
              </span>

              <strong>
                SCREAMER EDITION
              </strong>
            </div>

          </div>
        </section>

        {/* =================================================
            SYSTEM STRIP
        ================================================= */}

        <section className="gn-system-strip">

          <div className="gn-system-item">
            <div className="gn-system-icon">
              <BarChart3 size={20} />
            </div>

            <div>
              <small>
                MARKET FEED
              </small>

              <strong>
                {quoteStatus}
              </strong>
            </div>
          </div>

          <div className="gn-system-item">
            <div className="gn-system-icon">
              <Bot size={20} />
            </div>

            <div>
              <small>
                GHOST AI
              </small>

              <strong>
                READY
              </strong>
            </div>
          </div>

          <div className="gn-system-item">
            <div className="gn-system-icon">
              <TrendingUp size={20} />
            </div>

            <div>
              <small>
                MARKET ENGINE
              </small>

              <strong>
                {quoteStatus}
              </strong>
            </div>
          </div>

          <div className="gn-system-item">
            <div className="gn-system-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <small>
                SECURITY
              </small>

              <strong>
                PROTECTED
              </strong>
            </div>
          </div>

          <div className="gn-system-item">
            <div className="gn-system-icon">
              <Globe2 size={20} />
            </div>

            <div>
              <small>
                NETWORK
              </small>

              <strong>
                GLOBAL
              </strong>
            </div>
          </div>

        </section>

        {/* =================================================
            LIVE MARKETS
        ================================================= */}

        <section
          className="gn-live-market-section"
          id="markets"
        >

          <div className="gn-section-heading gn-section-heading-left">

            <span className="gn-section-kicker">
              LIVE MARKET INTELLIGENCE
            </span>

            <h2>
              Watch the market{" "}
              <span>move.</span>
            </h2>

            <p>
              Prices below are requested
              directly from the Ghost Nexus
              market API. No static price is
              displayed as live data.
            </p>

          </div>

          <div className="gn-market-grid">

            {SYMBOLS.map((symbol) => {

              const item =
                quoteMap[symbol];

              const price =
                getPrice(item);

              const change =
                getChange(item);

              const values =
                history[symbol] || [];

              return (
                <button
                  type="button"
                  className={`gn-market-card ${
                    selectedSymbol === symbol
                      ? "active"
                      : ""
                  }`}
                  key={symbol}
                  onClick={() =>
                    setSelectedSymbol(symbol)
                  }
                >

                  <div className="gn-market-card-top">

                    <span>
                      {FALLBACK_NAMES[symbol]}
                    </span>

                    <span className="gn-market-live">
                      <i />
                      LIVE
                    </span>

                  </div>

                  <div className="gn-market-price">
                    {formatPrice(
                      symbol,
                      price
                    )}
                  </div>

                  <div className="gn-market-bottom">

                    <span
                      className={
                        change === null
                          ? "neutral"
                          : change >= 0
                          ? "positive"
                          : "negative"
                      }
                    >
                      {change === null
                        ? "Waiting for feed"
                        : `${
                            change >= 0
                              ? "+"
                              : ""
                          }${change.toFixed(
                            2
                          )}%`}
                    </span>

                    <Sparkline
                      values={values}
                    />

                  </div>

                </button>
              );
            })}

          </div>
        </section>

        {/* =================================================
            TRADINGVIEW
        ================================================= */}

        <section className="gn-chart-section">

          <div className="gn-chart-heading">

            <div>

              <span className="gn-section-kicker">
                TRADINGVIEW
              </span>

              <h2>
                {FALLBACK_NAMES[selectedSymbol]}{" "}
                <span>
                  Live Chart
                </span>
              </h2>

            </div>

            <div className="gn-chart-price-badge">

              <small>
                {quoteStatus}
              </small>

              <strong>
                {formatPrice(
                  selectedSymbol,
                  selectedPrice
                )}
              </strong>

              <span
                className={
                  selectedChange === null
                    ? ""
                    : selectedChange >= 0
                    ? "positive"
                    : "negative"
                }
              >
                {selectedChange === null
                  ? "—"
                  : `${
                      selectedChange >= 0
                        ? "+"
                        : ""
                    }${selectedChange.toFixed(
                      2
                    )}%`}
              </span>

            </div>

          </div>

          <div className="gn-chart-tabs">

            {SYMBOLS.map((symbol) => (
              <button
                type="button"
                className={
                  selectedSymbol === symbol
                    ? "active"
                    : ""
                }
                key={symbol}
                onClick={() =>
                  setSelectedSymbol(symbol)
                }
              >
                {FALLBACK_NAMES[symbol]}
              </button>
            ))}

          </div>

          <TradingViewPanel
            symbol={selectedSymbol}
          />

        </section>

        {/* =================================================
            ECOSYSTEM
        ================================================= */}

        <section className="gn-home-section">

          <div className="gn-section-heading">

            <span className="gn-section-kicker">
              THE ECOSYSTEM
            </span>

            <h2>
              Built beyond{" "}
              <span>
                ordinary trading.
              </span>
            </h2>

            <p>
              One clean ecosystem connecting
              market intelligence, AI technology,
              trading tools and mentors.
            </p>

          </div>

          <div className="gn-feature-grid">

            <article className="gn-feature-card">

              <div className="gn-feature-number">
                01
              </div>

              <div className="gn-feature-icon">
                <BarChart3 size={25} />
              </div>

              <h3>
                Live Markets
              </h3>

              <p>
                Follow live market information
                and interactive TradingView charts.
              </p>

              <Link to="/dashboard">
                OPEN DASHBOARD
                <ArrowRight size={16} />
              </Link>

            </article>

            <article className="gn-feature-card">

              <div className="gn-feature-number">
                02
              </div>

              <div className="gn-feature-icon">
                <Bot size={25} />
              </div>

              <h3>
                Ghost AI
              </h3>

              <p>
                Explore the Ghost Nexus AI
                technology and trading ecosystem.
              </p>

              <Link to="/download">
                EXPLORE
                <ArrowRight size={16} />
              </Link>

            </article>

            <article className="gn-feature-card">

              <div className="gn-feature-number">
                03
              </div>

              <div className="gn-feature-icon">
                <Users size={25} />
              </div>

              <h3>
                Mentor Network
              </h3>

              <p>
                Apply to become a mentor and
                join the Ghost Nexus network.
              </p>

              <Link to="/mentor/apply">
                START APPLICATION
                <ArrowRight size={16} />
              </Link>

            </article>

          </div>

        </section>

        {/* =================================================
            MEDIA
        ================================================= */}

        <section className="gn-media-section">

          <div className="gn-media-copy">

            <span className="gn-section-kicker">
              THE GHOST VISUAL SYSTEM
            </span>

            <h2>
              Classic. Smooth.{" "}
              <span>Furious.</span>
            </h2>

            <p>
              The Screamer Edition identity
              brings the Ghost Nexus skull into
              the centre of the experience with
              glass surfaces, depth, motion and
              neon light.
            </p>

          </div>

          <div className="gn-media-grid">

            <div className="gn-media-card gn-media-image-card">

              <img
                src="/ghost-nexus-skull.png"
                alt="Ghost Nexus Screamer Edition"
              />

              <div className="gn-media-overlay">

                <strong>
                  SCREAMER EDITION
                </strong>

                <span>
                  GHOST NEXUS VISUAL CORE
                </span>

              </div>

            </div>

            <div className="gn-media-card gn-media-video-card">

              <video
                controls
                muted
                loop
                playsInline
                poster="/ghost-nexus-skull.png"
              >
                <source
                  src="/ghost-nexus.mp4"
                  type="video/mp4"
                />
              </video>

              <div className="gn-video-fallback">

                <Radio size={22} />

                <strong>
                  GHOST NEXUS VIDEO
                </strong>

                <span>
                  Add{" "}
                  <code>
                    /public/ghost-nexus.mp4
                  </code>{" "}
                  to activate this panel.
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            MENTOR CTA
        ================================================= */}

        <section className="gn-mentor-section">

          <div className="gn-mentor-background">
            <div className="gn-mentor-glow" />
          </div>

          <div className="gn-mentor-content">

            <div className="gn-mentor-icon">
              <Users size={30} />
            </div>

            <span className="gn-section-kicker">
              MENTOR APPLICATIONS OPEN
            </span>

            <h2>
              Share your knowledge.
              <span>
                Become a Ghost Mentor.
              </span>
            </h2>

            <p>
              Submit your application. The
              Ghost Nexus team can review it
              from the mentor administration
              system and approve or reject the
              application.
            </p>

            <Link
              to="/mentor/apply"
              className="gn-btn gn-btn-primary"
            >
              APPLY TO BECOME A MENTOR
              <ArrowRight size={18} />
            </Link>

          </div>

          <div className="gn-mentor-status">

            <span className="gn-status-dot" />

            APPLICATION SYSTEM READY

          </div>

        </section>

        {/* =================================================
            FINAL CTA
        ================================================= */}

        <section className="gn-home-cta">

          <div className="gn-home-cta-glow" />

          <div className="gn-home-cta-content">

            <span className="gn-section-kicker">
              ENTER THE ECOSYSTEM
            </span>

            <h2>
              Intelligence{" "}
              <span>
                Beyond Markets.
              </span>
            </h2>

            <p>
              Explore Ghost Nexus and connect
              with the next generation of trading
              technology.
            </p>

          </div>

          <div className="gn-home-cta-actions">

            <Link
              to="/dashboard"
              className="gn-btn gn-btn-primary"
            >
              ENTER DASHBOARD
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/pricing"
              className="gn-btn gn-btn-glass"
            >
              VIEW PRICING
            </Link>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
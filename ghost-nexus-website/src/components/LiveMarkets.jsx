import React, { useEffect, useRef } from "react";
import "../styles/LiveMarkets.css";

const TABS = [
  {
    title: "Forex",
    symbols: [
      { s: "OANDA:EURUSD", d: "EUR / USD" },
      { s: "OANDA:GBPUSD", d: "GBP / USD" },
      { s: "OANDA:USDJPY", d: "USD / JPY" },
      { s: "OANDA:USDCHF", d: "USD / CHF" },
      { s: "OANDA:USDCAD", d: "USD / CAD" },
      { s: "OANDA:AUDUSD", d: "AUD / USD" },
      { s: "OANDA:NZDUSD", d: "NZD / USD" },
      { s: "OANDA:EURGBP", d: "EUR / GBP" },
      { s: "OANDA:EURJPY", d: "EUR / JPY" },
      { s: "OANDA:GBPJPY", d: "GBP / JPY" },
      { s: "OANDA:AUDJPY", d: "AUD / JPY" },
    ],
  },

  {
    title: "Indices",
    symbols: [
      { s: "NASDAQ:NDX", d: "NAS100" },
      { s: "BLACKBULL:US30", d: "US30" },
      { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
      { s: "PEPPERSTONE:GER40", d: "GER40" },
      { s: "FOREXCOM:UK100", d: "UK100" },
    ],
  },

  {
    title: "Commodities",
    symbols: [
      { s: "OANDA:XAUUSD", d: "GOLD / XAUUSD" },
      { s: "OANDA:XAGUSD", d: "SILVER / XAGUSD" },
      { s: "TVC:USOIL", d: "US OIL" },
      { s: "TVC:UKOIL", d: "UK OIL" },
    ],
  },

  {
    title: "Crypto",
    symbols: [
      { s: "COINBASE:BTCUSD", d: "BITCOIN" },
      { s: "COINBASE:ETHUSD", d: "ETHEREUM" },
      { s: "BINANCE:BNBUSD", d: "BNB" },
      { s: "COINBASE:XRPUSD", d: "XRP" },
      { s: "COINBASE:SOLUSD", d: "SOLANA" },
      { s: "BINANCE:ADAUSD", d: "CARDANO" },
      { s: "BINANCE:DOGEUSD", d: "DOGECOIN" },
    ],
  },
];

function TradingViewMarketOverview() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container";

    const widgetInner = document.createElement("div");
    widgetInner.className = "tradingview-widget-container__widget";

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";

    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "1D",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: true,

      plotLineColorGrowing: "rgba(0, 255, 170, 1)",
      plotLineColorFalling: "rgba(255, 60, 80, 1)",
      gridLineColor: "rgba(255,255,255,0.06)",

      scaleFontColor: "#aeb7c7",
      belowLineFillColorGrowing: "rgba(0, 255, 170, 0.08)",
      belowLineFillColorFalling: "rgba(255, 60, 80, 0.08)",

      belowLineFillColorGrowingBottom: "rgba(0, 255, 170, 0)",
      belowLineFillColorFallingBottom: "rgba(255, 60, 80, 0)",

      symbolActiveColor: "rgba(255, 0, 60, 0.14)",

      tabs: TABS,
    });

    widget.appendChild(widgetInner);
    widget.appendChild(script);

    containerRef.current.appendChild(widget);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="ghost-tradingview-market-widget"
    />
  );
}

export default function LiveMarkets() {
  return (
    <section className="ghost-live-markets">
      <div className="ghost-live-markets-container">

        <div className="ghost-live-markets-heading">
          <div>
            <span className="ghost-live-markets-eyebrow">
              GHOST NEXUS MARKET CENTER
            </span>

            <h2>
              Live <span>Markets</span>
            </h2>

            <p>
              Monitor Forex, indices, commodities and crypto markets
              directly from the Ghost Nexus website.
            </p>
          </div>

          <div className="ghost-live-status">
            <span className="ghost-live-dot"></span>
            <span>LIVE MARKET DATA</span>
          </div>
        </div>

        <div className="ghost-market-category-row">
          <div className="ghost-market-category">
            <strong>FOREX</strong>
            <span>Major & cross pairs</span>
          </div>

          <div className="ghost-market-category">
            <strong>INDICES</strong>
            <span>NAS100 · US30 · S&amp;P</span>
          </div>

          <div className="ghost-market-category">
            <strong>COMMODITIES</strong>
            <span>Gold · Silver · Oil</span>
          </div>

          <div className="ghost-market-category">
            <strong>CRYPTO</strong>
            <span>BTC · ETH · XRP · SOL</span>
          </div>
        </div>

        <TradingViewMarketOverview />

        <div className="ghost-market-disclaimer">
          <span>Market data powered by TradingView.</span>
          <span>Quotes may vary by instrument and data provider.</span>
        </div>

      </div>
    </section>
  );
}
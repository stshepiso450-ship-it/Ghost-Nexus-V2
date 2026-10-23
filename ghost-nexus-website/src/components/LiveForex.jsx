import React, {
  useEffect,
  useState,
} from "react";
import "../styles/app.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const pairs = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "AUDUSD",
  "USDCAD",
  "USDCHF",
  "NZDUSD",
];

export default function LiveForex() {
  const [quotes, setQuotes] =
    useState([]);

  const [status, setStatus] =
    useState("CONNECTING");

  useEffect(() => {
    let mounted = true;

    const loadQuotes = async () => {
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
          throw new Error(
            "Quotes unavailable"
          );
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

        const filtered =
          pairs.map(
            (pair) => {
              const item =
                data.find(
                  (quote) =>
                    String(
                      quote.symbol ||
                        quote.instrument ||
                        ""
                    ).toUpperCase() ===
                    pair
                );

              return {
                symbol: pair,
                price:
                  item?.price ??
                  item?.bid ??
                  item?.last ??
                  null,
                change:
                  item?.change ??
                  item?.change_percent ??
                  item?.changePercent ??
                  null,
              };
            }
          );

        if (!mounted) return;

        setQuotes(filtered);
        setStatus("LIVE");
      } catch {
        if (mounted) {
          setStatus("WAITING");
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

  return (
    <section
      className="ghost-forex-section"
      aria-labelledby="forex-title"
    >
      <div className="ghost-forex-container">

        <div className="ghost-forex-header">

          <div>
            <span className="ghost-section-kicker">
              FOREX MARKET
            </span>

            <h2 id="forex-title">
              Live Forex
            </h2>
          </div>

          <div
            className={`ghost-forex-status ${
              status.toLowerCase()
            }`}
          >
            <span />
            {status}
          </div>

        </div>

        <div className="ghost-forex-grid">

          {quotes.length === 0
            ? pairs.map(
                (pair) => (
                  <div
                    className="ghost-forex-card"
                    key={pair}
                  >
                    <strong>
                      {pair}
                    </strong>

                    <span>
                      --
                    </span>

                    <small>
                      WAITING
                    </small>
                  </div>
                )
              )
            : quotes.map(
                (quote) => {

                  const numericChange =
                    Number(
                      quote.change
                    );

                  const positive =
                    numericChange > 0;

                  const negative =
                    numericChange < 0;

                  return (
                    <div
                      className="ghost-forex-card"
                      key={
                        quote.symbol
                      }
                    >

                      <strong>
                        {quote.symbol}
                      </strong>

                      <span>
                        {quote.price !==
                        null
                          ? Number(
                              quote.price
                            ).toFixed(
                              5
                            )
                          : "--"}
                      </span>

                      <small
                        className={
                          positive
                            ? "positive"
                            : negative
                            ? "negative"
                            : ""
                        }
                      >
                        {quote.change !==
                        null
                          ? `${
                              positive
                                ? "+"
                                : ""
                            }${Number(
                              quote.change
                            ).toFixed(
                              2
                            )}%`
                          : "--"}
                      </small>

                    </div>
                  );
                }
              )}

        </div>

      </div>
    </section>
  );
}
import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function FearGreed() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("CONNECTING");

  useEffect(() => {
    let mounted = true;

    const loadSentiment = async () => {
      try {
        const response = await fetch(
          `${API_URL}/market/fear-greed`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Fear and Greed endpoint unavailable"
          );
        }

        const result =
          await response.json();

        if (!mounted) return;

        setData(result);
        setStatus("LIVE");
      } catch {
        if (mounted) {
          setStatus("WAITING");
        }
      }
    };

    loadSentiment();

    const interval = setInterval(
      loadSentiment,
      60000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const value = Number(
    data?.value ??
      data?.score ??
      data?.index
  );

  const validValue =
    Number.isFinite(value)
      ? Math.max(0, Math.min(100, value))
      : null;

  const classification =
    data?.classification ||
    data?.label ||
    getClassification(validValue);

  const previous =
    data?.previous ??
    data?.previous_value ??
    "--";

  const updated =
    data?.updated_at ||
    data?.timestamp ||
    "--";

  const getNeedleRotation = () => {
    if (validValue === null) {
      return -90;
    }

    return -90 + validValue * 1.8;
  };

  return (
    <section
      className="ghost-fear-greed"
      aria-labelledby="fear-greed-title"
    >
      <div className="ghost-fear-container">

        <div className="ghost-fear-header">

          <div>
            <span className="ghost-section-kicker">
              MARKET SENTIMENT
            </span>

            <h2 id="fear-greed-title">
              Fear & Greed Index
            </h2>

            <p>
              Monitor broader market sentiment to
              understand whether market conditions
              are leaning toward fear or greed.
            </p>
          </div>

          <div className="ghost-calendar-status">

            <span
              className={`ghost-chart-dot ${status.toLowerCase()}`}
            />

            {status}

          </div>

        </div>

        <div className="ghost-fear-content">

          {/* GAUGE */}
          <div className="ghost-fear-gauge">

            <div className="ghost-gauge">

              <div className="ghost-gauge-track" />

              <div
                className="ghost-gauge-needle"
                style={{
                  transform: `rotate(${getNeedleRotation()}deg)`,
                }}
              />

              <div className="ghost-gauge-center">
                <strong>
                  {validValue !== null
                    ? Math.round(validValue)
                    : "--"}
                </strong>

                <span>
                  / 100
                </span>
              </div>

            </div>

            <div className="ghost-gauge-labels">

              <span>
                FEAR
              </span>

              <span>
                NEUTRAL
              </span>

              <span>
                GREED
              </span>

            </div>

          </div>

          {/* INFORMATION */}
          <div className="ghost-fear-info">

            <div className="ghost-fear-classification">

              <span>
                CURRENT SENTIMENT
              </span>

              <strong>
                {classification}
              </strong>

            </div>

            <div className="ghost-fear-stats">

              <div>
                <span>
                  CURRENT
                </span>

                <strong>
                  {validValue !== null
                    ? Math.round(validValue)
                    : "--"}
                </strong>
              </div>

              <div>
                <span>
                  PREVIOUS
                </span>

                <strong>
                  {previous}
                </strong>
              </div>

              <div>
                <span>
                  UPDATED
                </span>

                <strong>
                  {updated}
                </strong>
              </div>

            </div>

            <p className="ghost-fear-note">
              Market sentiment is one input among
              many. It should not be used as a
              standalone trading signal.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

function getClassification(value) {
  if (value === null) {
    return "WAITING";
  }

  if (value <= 25) {
    return "EXTREME FEAR";
  }

  if (value <= 45) {
    return "FEAR";
  }

  if (value <= 55) {
    return "NEUTRAL";
  }

  if (value <= 75) {
    return "GREED";
  }

  return "EXTREME GREED";
}
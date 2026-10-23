import React, {
  useEffect,
  useState,
} from "react";
import "../styles/app.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const fallbackEvents = [
  {
    time: "--",
    currency: "USD",
    event: "Economic calendar loading",
    impact: "MEDIUM",
    actual: "--",
    forecast: "--",
  },
];

export default function EconomicCalendar() {
  const [events, setEvents] =
    useState(fallbackEvents);

  const [status, setStatus] =
    useState("CONNECTING");

  useEffect(() => {
    let mounted = true;

    const loadCalendar = async () => {
      try {
        const response = await fetch(
          `${API_URL}/market/calendar`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Calendar unavailable"
          );
        }

        const result =
          await response.json();

        const data =
          Array.isArray(result)
            ? result
            : result.events ||
              result.calendar ||
              result.data ||
              [];

        if (!mounted) return;

        if (data.length > 0) {
          setEvents(data);
        }

        setStatus("LIVE");
      } catch {
        if (mounted) {
          setStatus("WAITING");
        }
      }
    };

    loadCalendar();

    const interval =
      setInterval(
        loadCalendar,
        60000
      );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section
      className="ghost-calendar-section"
      aria-labelledby="calendar-title"
    >
      <div className="ghost-calendar-container">

        <div className="ghost-calendar-header">

          <div>
            <span className="ghost-section-kicker">
              GLOBAL ECONOMIC EVENTS
            </span>

            <h2 id="calendar-title">
              Economic Calendar
            </h2>

            <p>
              Monitor major economic events
              that can influence financial
              markets.
            </p>
          </div>

          <div
            className={`ghost-calendar-status ${
              status.toLowerCase()
            }`}
          >
            <span />
            {status}
          </div>

        </div>

        <div className="ghost-calendar-table">

          <div className="ghost-calendar-row header">

            <span>
              TIME
            </span>

            <span>
              CURRENCY
            </span>

            <span>
              EVENT
            </span>

            <span>
              IMPACT
            </span>

            <span>
              ACTUAL
            </span>

            <span>
              FORECAST
            </span>

          </div>

          {events.map(
            (event, index) => {

              const impact =
                String(
                  event.impact ||
                    event.importance ||
                    "MEDIUM"
                ).toUpperCase();

              return (
                <div
                  className="ghost-calendar-row"
                  key={
                    event.id ||
                    `${event.event}-${index}`
                  }
                >

                  <span>
                    {event.time ||
                      event.date ||
                      "--"}
                  </span>

                  <span className="currency">
                    {event.currency ||
                      event.country ||
                      "--"}
                  </span>

                  <span className="event-name">
                    {event.event ||
                      event.title ||
                      "Economic event"}
                  </span>

                  <span>
                    <b
                      className={`impact ${impact.toLowerCase()}`}
                    >
                      {impact}
                    </b>
                  </span>

                  <span>
                    {event.actual ??
                      "--"}
                  </span>

                  <span>
                    {event.forecast ??
                      event.consensus ??
                      "--"}
                  </span>

                </div>
              );
            }
          )}

        </div>

      </div>
    </section>
  );
}
import React, {
  useEffect,
  useState,
} from "react";
import "../styles/app.css";

const sessions = [
  {
    name: "SYDNEY",
    open: 22,
    close: 7,
  },
  {
    name: "TOKYO",
    open: 0,
    close: 9,
  },
  {
    name: "LONDON",
    open: 8,
    close: 17,
  },
  {
    name: "NEW YORK",
    open: 13,
    close: 22,
  },
];

function isSessionOpen(
  hour,
  open,
  close
) {
  if (open < close) {
    return (
      hour >= open &&
      hour < close
    );
  }

  return (
    hour >= open ||
    hour < close
  );
}

export default function MarketSessions() {
  const [now, setNow] =
    useState(new Date());

  useEffect(() => {
    const interval =
      setInterval(() => {
        setNow(new Date());
      }, 1000);

    return () =>
      clearInterval(interval);
  }, []);

  const currentHour =
    now.getUTCHours();

  return (
    <section
      className="ghost-sessions-section"
      aria-labelledby="sessions-title"
    >
      <div className="ghost-sessions-container">

        <div className="ghost-sessions-header">

          <div>
            <span className="ghost-section-kicker">
              GLOBAL TRADING HOURS
            </span>

            <h2 id="sessions-title">
              Market Sessions
            </h2>

            <p>
              See which major forex market
              sessions are currently active.
            </p>
          </div>

          <div className="ghost-utc-clock">
            <span>
              UTC
            </span>

            <strong>
              {now.toUTCString().slice(
                17,
                25
              )}
            </strong>
          </div>

        </div>

        <div className="ghost-sessions-grid">

          {sessions.map(
            (session) => {

              const open =
                isSessionOpen(
                  currentHour,
                  session.open,
                  session.close
                );

              return (
                <article
                  className={`ghost-session-card ${
                    open ? "open" : "closed"
                  }`}
                  key={session.name}
                >

                  <div className="ghost-session-top">

                    <strong>
                      {session.name}
                    </strong>

                    <span>
                      <i />
                      {open
                        ? "OPEN"
                        : "CLOSED"}
                    </span>

                  </div>

                  <div className="ghost-session-hours">
                    {String(
                      session.open
                    ).padStart(
                      2,
                      "0"
                    )}
                    :00 —{" "}
                    {String(
                      session.close
                    ).padStart(
                      2,
                      "0"
                    )}
                    :00 UTC
                  </div>

                  <div className="ghost-session-bar">

                    <div
                      style={{
                        width: open
                          ? "70%"
                          : "20%",
                      }}
                    />

                  </div>

                </article>
              );
            }
          )}

        </div>

        <div className="ghost-session-note">
          Session times are displayed in UTC.
          Actual market liquidity can vary
          around holidays, daylight-saving changes
          and major economic events.
        </div>

      </div>
    </section>
  );
}
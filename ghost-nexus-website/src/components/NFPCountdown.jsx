import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import "../styles/app.css";

function getNextNFP() {
  const now = new Date();

  const year = now.getFullYear();

  const dates = [];

  for (
    let month = 0;
    month < 12;
    month++
  ) {
    const firstDay =
      new Date(
        year,
        month,
        1
      );

    const firstFriday =
      1 +
      ((5 -
        firstDay.getDay() +
        7) %
        7);

    const nfpDate =
      new Date(
        year,
        month,
        firstFriday,
        14,
        30,
        0
      );

    if (nfpDate > now) {
      dates.push(nfpDate);
    }
  }

  if (dates.length > 0) {
    return dates[0];
  }

  return new Date(
    year + 1,
    0,
    1,
    14,
    30,
    0
  );
}

function calculateTime(target) {
  const difference =
    target.getTime() -
    Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    ),

    hours: Math.floor(
      (difference /
        (1000 * 60 * 60)) %
        24
    ),

    minutes: Math.floor(
      (difference /
        (1000 * 60)) %
        60
    ),

    seconds: Math.floor(
      (difference / 1000) % 60
    ),
  };
}

export default function NFPCountdown() {
  const target =
    useMemo(
      () => getNextNFP(),
      []
    );

  const [time, setTime] =
    useState(
      calculateTime(target)
    );

  useEffect(() => {
    const interval =
      setInterval(() => {
        setTime(
          calculateTime(target)
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [target]);

  return (
    <section
      className="ghost-nfp-section"
      aria-labelledby="nfp-title"
    >
      <div className="ghost-nfp-container">

        <div className="ghost-nfp-content">

          <span className="ghost-section-kicker">
            HIGH-IMPACT EVENT
          </span>

          <h2 id="nfp-title">
            Non-Farm Payrolls
          </h2>

          <p>
            Track the countdown to the next
            major US employment report.
          </p>

          <span className="ghost-nfp-date">
            {target.toLocaleString(
              undefined,
              {
                dateStyle: "full",
                timeStyle: "short",
              }
            )}
          </span>

        </div>

        <div className="ghost-nfp-countdown">

          {[
            ["DAYS", time.days],
            ["HOURS", time.hours],
            ["MINUTES", time.minutes],
            ["SECONDS", time.seconds],
          ].map(
            ([label, value]) => (
              <div
                className="ghost-nfp-unit"
                key={label}
              >
                <strong>
                  {String(
                    value
                  ).padStart(2, "0")}
                </strong>

                <span>
                  {label}
                </span>
              </div>
            )
          )}

        </div>

      </div>
    </section>
  );
}
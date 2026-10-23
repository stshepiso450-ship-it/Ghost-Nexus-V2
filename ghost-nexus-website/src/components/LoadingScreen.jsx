import React, { useEffect, useState } from "react";
import "../styles/app.css";

export default function LoadingScreen({
  minimumTime = 1200,
  onComplete,
}) {
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;

      const calculatedProgress =
        Math.min(
          100,
          Math.round(
            (elapsed / minimumTime) * 100
          )
        );

      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          setFinished(true);

          if (typeof onComplete === "function") {
            onComplete();
          }
        }, 250);
      }
    }, 30);

    return () => {
      clearInterval(interval);
    };
  }, [minimumTime, onComplete]);

  if (finished) {
    return null;
  }

  return (
    <div
      className="ghost-loading-screen"
      role="status"
      aria-label="Loading Ghost Nexus"
    >

      <div className="ghost-loading-core">

        <div className="ghost-loading-ring ring-one" />
        <div className="ghost-loading-ring ring-two" />
        <div className="ghost-loading-ring ring-three" />

        <div className="ghost-loading-logo">
          G
        </div>

      </div>

      <div className="ghost-loading-brand">
        <strong>
          GHOST NEXUS
        </strong>

        <span>
          MARKET INTELLIGENCE
        </span>
      </div>

      <div className="ghost-loading-progress">

        <div className="ghost-loading-progress-bar">
          <div
            className="ghost-loading-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="ghost-loading-progress-text">
          <span>
            INITIALIZING SYSTEM
          </span>

          <strong>
            {progress}%
          </strong>
        </div>

      </div>

    </div>
  );
}
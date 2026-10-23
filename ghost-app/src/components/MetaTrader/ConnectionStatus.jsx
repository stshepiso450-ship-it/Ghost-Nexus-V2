import React from "react";

const ConnectionStatus = ({
  connected,
  loading,
  terminal,
}) => {
  return (
    <div className="mt5-card">

      <h2 className="mt5-card-title">
        Connection Status
      </h2>

      <div className="mt5-grid">

        <div className="mt5-stat">

          <div className="mt5-stat-label">
            Status
          </div>

          <div
            className="mt5-stat-value"
            style={{
              color: connected
                ? "#00ff88"
                : "#ff4040",
            }}
          >
            {loading
              ? "Checking..."
              : connected
              ? "Connected"
              : "Disconnected"}
          </div>

        </div>

        <div className="mt5-stat">

          <div className="mt5-stat-label">
            Terminal
          </div>

          <div className="mt5-stat-value">
            {terminal?.name || "Unknown"}
          </div>

        </div>

        <div className="mt5-stat">

          <div className="mt5-stat-label">
            Build
          </div>

          <div className="mt5-stat-value">
            {terminal?.build || "--"}
          </div>

        </div>

        <div className="mt5-stat">

          <div className="mt5-stat-label">
            Company
          </div>

          <div className="mt5-stat-value">
            {terminal?.company || "--"}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ConnectionStatus;
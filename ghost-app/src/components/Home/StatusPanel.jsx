import React from "react";

function StatusPanel() {

  return (

    <div className="status-panel">

      <div className="status-title">

        System Status

      </div>

      <div className="status-row">

        <span className="status-label">

          Ghost Server

        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          <div className="status-dot"></div>

          <span className="status-value">

            Online

          </span>

        </div>

      </div>

      <div className="status-row">

        <span className="status-label">

          MetaTrader 5

        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          <div className="status-dot"></div>

          <span className="status-value">

            Connected

          </span>

        </div>

      </div>

      <div className="status-row">

        <span className="status-label">

          AI Scanner

        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          <div className="status-dot"></div>

          <span className="status-value">

            Running

          </span>

        </div>

      </div>

      <div className="status-row">

        <span className="status-label">

          License

        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          <div className="status-dot"></div>

          <span className="status-value">

            Valid

          </span>

        </div>

      </div>

    </div>

  );

}

export default StatusPanel;
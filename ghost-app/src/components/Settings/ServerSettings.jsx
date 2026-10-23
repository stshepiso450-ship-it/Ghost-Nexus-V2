import React, { useState } from "react";
import "./ServerSettings.css";

export default function ServerSettings() {

  const [connected, setConnected] = useState(false);

  function connectServer() {

    setConnected(!connected);

  }

  return (

    <div className="setting-card">

      <div className="setting-header">

        <div className="setting-title">

          <span className="setting-icon">🖥</span>

          SERVER SETTINGS

        </div>

      </div>

      <div className="server-body">

        <div className="server-circle">

          <div
            className={
              connected
                ? "server-dot online"
                : "server-dot offline"
            }
          />

        </div>

        <h3>

          {connected
            ? "Backend Connected"
            : "Backend Offline"}

        </h3>

        <p>

          192.168.68.156:8000

        </p>

        <button
          className="server-btn"
          onClick={connectServer}
        >

          {connected
            ? "Disconnect"
            : "Connect"}

        </button>

      </div>

    </div>

  );

}
import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">

      <div className="header-left">

        <div className="logo-circle">
          👻
        </div>

        <div>

          <h1>Ghost Nexus</h1>

          <p>AI Trading Platform</p>

        </div>

      </div>

      <div className="header-right">

        <div className="server-status">

          <span className="status-dot"></span>

          ONLINE

        </div>

      </div>

    </header>
  );
}